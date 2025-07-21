package service

import (
    "context"
    "database/sql"
    "fmt"
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
	if len(emotionCount) == 0 {
        return ""
    }

	// Определим противоположные эмоции
	oppositeEmotions := map[string]string{
		"joy":      "sadness",
		"sadness":  "joy",
		"anger":    "calm",
		"calm":     "anger",
		"excited":  "bored",
		"bored":    "excited",
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

func (s *TotalService) CalculateDailyTotal(ctx context.Context, userID int, date time.Time) error {
    log.Printf("CalculateDailyTotal: calculating for user %d on %s", userID, date.Format("2006-01-02"))
    
    records, err := repository.GetRecordsByDate(ctx, s.db, userID, date, 0)
    if err != nil {
        return fmt.Errorf("failed to get records: %w", err)
    }

    if len(records) == 0 {
        log.Printf("No records found for date %s, deleting total if exists", date.Format("2006-01-02"))
        if err := repository.DeleteUserTotal(ctx, s.db, userID, date); err != nil && err != sql.ErrNoRows {
            return fmt.Errorf("failed to delete total: %w", err)
        }
        return nil
    }

    emotionCount := make(map[string]int)
    var summaries []string
    
    for _, record := range records {
        if record.Emotion != "" {
            emotionCount[record.Emotion]++
        }
        if record.Summary != "" {
            summaries = append(summaries, record.Summary)
        }
    }

    dominantEmotion := s.calculateDominantEmotion(emotionCount)
    
    var combinedSummary string
    if len(summaries) > 0 {
        combinedSummary, err = s.GetCombinedSummary(ctx, summaries)
        if err != nil {
            return fmt.Errorf("failed to get combined summary: %w", err)
        }
    }

    if err := repository.SaveOrUpdateUserTotal(ctx, s.db, userID, date, dominantEmotion, combinedSummary); err != nil {
        return fmt.Errorf("failed to save total: %w", err)
    }

    log.Printf("Successfully calculated total for user %d on %s", userID, date.Format("2006-01-02"))
    return nil
}