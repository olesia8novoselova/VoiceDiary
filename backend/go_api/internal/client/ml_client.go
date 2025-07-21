package client

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"log"
)

type AnalysisResult struct {
	Emotion string `json:"emotion"`
	Summary string `json:"summary"`
	Text string `json:"text"`
	Insights map[string]any `json:"insights"`
}

func CallMLService(ctx context.Context, mlURL string, fileBytes []byte) (*AnalysisResult, error) {
	log.Printf("CallMLService: sending request to ML service at %s", mlURL)

	// Create a new multipart writer
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", "audio.wav")
	if err != nil {
		log.Printf("CallMLService: failed to create form file, error: %v", err)
		return nil, err
	}
	if _, err := io.Copy(part, bytes.NewReader(fileBytes)); err != nil {
		log.Printf("CallMLService: failed to copy file bytes, error: %v", err)
		return nil, err
	}
	writer.Close()
	log.Printf("CallMLService: created multipart form with file")

	// Create HTTP POST-request
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, mlURL+"/analyze", body)
	if err != nil {
		log.Printf("CallMLService: failed to create request, error: %v", err)
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	log.Printf("CallMLService: set request headers")

	// Send request
 	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("CallMLService: failed to send request, error: %v", err)
		return nil, err
	}
	defer resp.Body.Close()
	log.Printf("CallMLService: received response with status code %d", resp.StatusCode)

	// decode JSON response
	var result AnalysisResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("CallMLService: failed to decode response, error: %v", err)
		return nil, err
	}
	
	log.Printf("CallMLService: successfully decoded response, emotion: %s, summary: %s, text: %s", result.Emotion, result.Summary, result.Text)
	return &result, nil
}

func CallMLServiceWithInsights(ctx context.Context, mlURL string, text string) (*AnalysisResult, error) {
	log.Printf("CallMLServiceWithInsights: sending text to ML service at %s", mlURL)

	payload := map[string]string{"text": text}
	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, mlURL+"/insights", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result AnalysisResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func CallMLServiceWithCombinedText(ctx context.Context, mlURL string, combinedText string) (*AnalysisResult, error) {
    log.Printf("CallMLServiceWithCombinedText: sending combined text to ML service")

    payload := map[string]string{"text": combinedText}
    jsonBytes, err := json.Marshal(payload)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequestWithContext(ctx, http.MethodPost, mlURL+"/process_text", bytes.NewBuffer(jsonBytes))
    if err != nil {
        return nil, err
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    // Decode as generic map to avoid binding to emotion type
    var raw map[string]any
    if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
        log.Printf("CallMLServiceWithCombinedText: failed to decode response, error: %v", err)
        return nil, err
    }

    // log emotion if present
    if em, ok := raw["emotion"]; ok {
        log.Printf("CallMLServiceWithCombinedText: ML returned emotion (ignored by Go): %v", em)
    }

    // Extract remaining fields safely
    summary, _ := raw["summary"].(string)
    text, _ := raw["text"].(string)
    insights, _ := raw["insights"].(map[string]any)

    result := &AnalysisResult{
        Emotion:  "", // not used — final emotion will be calculated later
        Summary:  summary,
        Text:     text,
        Insights: insights,
    }

    log.Printf("CallMLServiceWithCombinedText: successfully parsed ML summary")
    return result, nil
}


