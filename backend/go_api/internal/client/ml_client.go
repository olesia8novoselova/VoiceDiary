package client

import (
	"net/http"
	"context"
	"encoding/json"
	"bytes"
)

type AnalysisResult struct {
	Emotion string `json:"emotion"`
	Tone string `json:"tone"`
	Themes []string `json:"themes"`
}

func CallMLService(ctx context.Context, mlURL string, dataURL string) (*AnalysisResult, error) {
	// request body
	payload := map[string]string{
		"data_url": dataURL,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	// create HTTP POST-request
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, mlURL+"/analyze", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	// send request
 	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// decode JSON response
	var result AnalysisResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

