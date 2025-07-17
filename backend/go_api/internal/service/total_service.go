package service

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/client"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/repository"
)

type TotalService struct {
	db *sql.DB
    mlURL string
}

func NewTotalService(db *sql.DB, mlURL string) *TotalService {
	return &TotalService{
		db:    db,
		mlURL: mlURL,
	}
}

func (s *TotalService) UpdateUserTotal(ctx context.Context, userID int, date time.Time, emotion, summary string) error {
	return repository.SaveOrUpdateUserTotal(ctx, s.db, userID, date, emotion, summary)
}

func (s *TotalService) GetUserTotals(ctx context.Context, userID int, startDate, endDate time.Time) ([]repository.UserTotal, error) {
	return repository.GetUserTotalsByDateRange(ctx, s.db, userID, startDate, endDate)
}

func (s *TotalService) GetCombinedSummary(ctx context.Context, summaries []string) (string, error) {
	log.Printf("GetCombinedSummary: sending %d summaries to ML service", len(summaries))

	// Объединяем все summary через разделитель
	combinedText := strings.Join(summaries, "\n---\n")

	// Отправляем в ML-сервис
	result, err := client.CallMLServiceWithCombinedText(ctx, s.mlURL, combinedText)
	if err != nil {
		log.Printf("GetCombinedSummary: failed to get combined summary, error: %v", err)
		return "", err
	}

	log.Printf("GetCombinedSummary: successfully received combined summary")
	return result.Summary, nil
}

func (s *TotalService) calculateDominantEmotion(emotionCount map[string]int) string {
	// Определим противоположные эмоции
	oppositeEmotions := map[string]string{
		"happy":   "sad",
		"sad":     "happy",
		"angry":   "calm",
		"calm":    "angry",
		"excited": "bored",
		"bored":   "excited",
	}

	// Найдем максимальное количество
	maxCount := 0
	for _, count := range emotionCount {
		if count > maxCount {
			maxCount = count
		}
	}

	// Соберем все эмоции с максимальным количеством
	var topEmotions []string
	for emotion, count := range emotionCount {
		if count == maxCount {
			topEmotions = append(topEmotions, emotion)
		}
	}

	// Если только одна эмоция лидирует
	if len(topEmotions) == 1 {
		return topEmotions[0]
	}

	// Проверим, есть ли среди лидеров противоположные эмоции
	for i, emotion1 := range topEmotions {
		for _, emotion2 := range topEmotions[i+1:] {
			if oppositeEmotions[emotion1] == emotion2 {
				return "neutral" // Возвращаем neutral при противоречии
			}
		}
	}

	// Если противоположных нет, возвращаем первую из лидирующих
	return topEmotions[0]
}

// Вычисляем доминирующую эмоцию за день на основе всех записей
func (s *TotalService) CalculateDailyTotal(ctx context.Context, userID int, date time.Time) error {
	log.Printf("CalculateDailyTotal: calculating for user %d on %s", userID, date.Format("2006-01-02"))

	// Получаем все записи пользователя за указанную дату
	records, err := repository.GetRecordsStartingFromDate(ctx, s.db, userID, date, 0)
	if err != nil {
		return err
	}

	if len(records) == 0 {
		return nil
	}

	emotionCount := make(map[string]int)
	var allSummaries []string

	for _, record := range records {
		emotionCount[record.Emotion]++
		allSummaries = append(allSummaries, record.Summary)
	}

	// общая эмоция
	Emotion := s.calculateDominantEmotion(emotionCount)

	// Генерируем общий summary
	summary, err := s.GetCombinedSummary(ctx, allSummaries)
    if err != nil {
        return err
    }

	// Сохраняем результат
	return s.UpdateUserTotal(ctx, userID, date, Emotion, summary)
}
