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
	
	log.Printf("CallMLService: successfully decoded response, emotion: %s, summary: %s", result.Emotion, result.Summary)
	return &result, nil
}

