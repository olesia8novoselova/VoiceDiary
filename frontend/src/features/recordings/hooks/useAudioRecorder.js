import { useState, useRef, useEffect, useCallback } from "react";
import { API_CONFIG } from "../../../config";

const useAudioRecorder = ({ setIsRecording, onRecordingStart, onResult }) => {
  const [isRecording, setRecording] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [permission, setPermission] = useState("prompt");
  const [showControls, setShowControls] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone",
        });
        updatePermissionState(permissionStatus.state);

        permissionStatus.onchange = () => {
          updatePermissionState(permissionStatus.state);
        };
      } catch (err) {
        console.log("Permission API not supported, using default flow");
      }
    };

    checkPermission();
  }, []);

  const updatePermissionState = (state) => {
    setPermission(state === "granted" ? "granted" : "prompt");
  };

  const resetRecorder = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
    mediaRecorder.current = null;
    audioChunks.current = [];
    clearInterval(timerRef.current);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      if (mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      clearInterval(timerRef.current);
      setRecording(false);
      setPaused(false);
      setShowControls(false);
    }
  }, [isRecording]);

  useEffect(() => {
    setIsRecording(isRecording);
    return () => {
      stopRecording();
    };
  }, [isRecording, setIsRecording, stopRecording]);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission("granted");
      return stream;
    } catch (err) {
      console.error("Microphone access denied:", err);
      setPermission("denied");
      return null;
    }
  };

  const startRecording = async () => {
    if (permission === "denied") {
      alert(
        "Please enable microphone access in your browser settings to record audio."
      );
      return;
    }

    if (onRecordingStart) {
      onRecordingStart();
    }

    try {
      resetRecorder();

      let stream;
      if (permission !== "granted") {
        stream = await requestMicrophoneAccess();
        if (!stream) return;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start(100);
      setRecording(true);
      setPaused(false);
      setRecordTime(0);
      setShowControls(true);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermission("denied");
    }
  };

  const togglePause = () => {
    if (!mediaRecorder.current) return;

    if (isPaused) {
      mediaRecorder.current.resume();
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorder.current.pause();
      clearInterval(timerRef.current);
    }
    setPaused(!isPaused);
  };

  const cancelRecording = () => {
    setIsActionInProgress(false);
    stopRecording();
    setAudioBlob(null);
    setRecordTime(0);
    resetRecorder();
    setShowDeleteConfirm(false);
  };

  const handleDeleteClick = () => {
    setIsActionInProgress(true);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setIsActionInProgress(false);
    setShowDeleteConfirm(false);
  };

  const saveRecording = async () => {
  setIsActionInProgress(true);
  if (audioBlob) {
    try {
      setIsLoading(true);
      setRecordTime(0);
      setAudioBlob(null);
      resetRecorder();

      const formData = new FormData();
      formData.append(
        "file",
        audioBlob,
        `voice-${new Date().toISOString()}.wav`
      );
      formData.append("userID", "-1");

      console.log('FormData content:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECORDS.UPLOAD}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log('First response result:', result);

      if (onResult) {
        onResult({
          emotion: result.emotion,
          summary: result.summary,
          record_date: new Date(),
        });
      }

      if (result.text) {
        try {
          const insightsRequestData = { 
            text: result.text, 
            record_id: result.record_id 
          };
          console.log('Second request payload:', insightsRequestData);

          const insightsResponse = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECORDS.GET_INSIGHTS}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(insightsRequestData),
            }
          );

          console.log('Second response status:', insightsResponse.status);

          if (insightsResponse.ok) {
            const insightsResult = await insightsResponse.json();
            console.log('Second response result:', insightsResult);

            if (onResult) {
              onResult((prev) => ({
                ...prev,
                insights: insightsResult.insights,
              }));
            }
          } else {
            const errorResponse = await insightsResponse.text();
            console.error('Second request failed with response:', errorResponse);
          }
        } catch (insightsError) {
          console.error("Error fetching insights:", insightsError);
        }
      }
    } catch (error) {
      console.error("Error during processing:", error);
      alert("Error during processing:", error);
    } finally {
      setAudioBlob(null);
      setRecordTime(0);
      resetRecorder();
      setIsActionInProgress(false);
      setIsLoading(false);
    }
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleMainButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    isPaused,
    recordTime,
    audioBlob,
    permission,
    showControls,
    isLoading,
    showDeleteConfirm,
    isActionInProgress,
    togglePause,
    cancelRecording,
    handleDeleteClick,
    handleDeleteCancel,
    saveRecording,
    formatTime,
    handleMainButtonClick,
    startRecording,
    stopRecording,
  };
};

export default useAudioRecorder;