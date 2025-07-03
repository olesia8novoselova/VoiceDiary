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
        formData.append("userID", "1");

        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECORDS.UPLOAD}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          setAudioBlob(null);
          setRecordTime(0);
          resetRecorder();
          setIsActionInProgress(false);
          throw new Error("Upload failed");
        }

        const result = await response.json();

        if (onResult) {
          onResult({
            emotion: result.emotion,
            summary: result.summary,
            record_date: new Date(),
          });
        }

        // await new Promise((resolve) => setTimeout(resolve, 2000));

        // if (onResult) {
        //   onResult({
        //     emotion: "happy",
        //     summary:
        //       "Today was a dynamic and emotionally complex day. In the morning, I received unexpected news about a promotion at work, which sparked intense joy. However, after lunch, an email about urgent quarterly budget revisions triggered mild anxiety. Despite the mixed emotions, I managed to unwind during a family dinner in the evening, which brought a sense of balance.",
        //     record_date: new Date(),
        //     insights: {
        //       emotional_dynamics:
        //         "Sharp mood elevation in the morning followed by a moderate dip in the afternoon",
        //       key_triggers: [
        //         "Positive: Career advancement notification",
        //         "Negative: Financial responsibility pressure",
        //       ],
        //       physical_reactions: {
        //         morning: "Increased energy levels (noted at 10:15 AM)",
        //         afternoon: "Brief tension headache (around 4:30 PM)",
        //       },
        //       coping_effectiveness: {
        //         successful: "Sharing news with colleagues (reinforced joy)",
        //         unsuccessful:
        //           "Compulsively checking emails (amplified anxiety)",
        //       },
        //       behavioral_patterns: {
        //         productivity: "Focused work in the morning (3h deep work)",
        //         social_interaction: "Initiated 2 meaningful conversations",
        //       },
        //       recommendations: [
        //         "Celebration: Schedule a team lunch to acknowledge achievement",
        //         "Stress management: Practice box breathing before high-stakes meetings",
        //         "Future planning: Allocate 30min daily for financial planning to reduce anxiety triggers",
        //       ],
        //     },
        //   });
        // }

        setAudioBlob(null);
        setRecordTime(0);
        resetRecorder();
        setIsActionInProgress(false);
      } catch (error) {
        console.error("Error during processing:", error);
        alert("Error during processing:", error);
      } finally {
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

// const saveRecording = async () => {
//   if (audioBlob) {
//     try {
//       setIsLoading(true);

//       const formData = new FormData();
//       formData.append(
//         "file",
//         audioBlob,
//         `voice-${new Date().toISOString()}.wav`
//       );
//       formData.append("userID", "1");

//       // const response = await fetch(
//       //   "https://68b0-2a0b-4140-d5a0-00-2.ngrok-free.app/records/upload",
//       //   {
//       //     method: "POST",
//       //     body: formData,
//       //   }
//       // );

//       // const result = await response.json();
//       // // const recordID = result.record_id;

//       // if (!response.ok) {
//       //   throw new Error("Upload failed");
//       // }

//       //         const analysisResponse = await fetch(
//       //           `http://localhost:8080/records/${recordID}`
//       //         );
//       //         if (!analysisResponse.ok) {
//       //           throw new Error("Analysis failed");
//       //         }
//       //
//       //         const analysisData = await analysisResponse.json();

//       // if (onResult) {
//       //   onResult({
//       //     emotion: result.emotion,
//       //     summary: result.summary,
//       //     record_date: new Date(),
//       //     insights: result.insights,
//       //   });
//       // }

//       if (onResult) {
//         onResult({
//           emotion: "happy",
//           summary:
//             "Today was a dynamic and emotionally complex day. In the morning, I received unexpected news about a promotion at work, which sparked intense joy. However, after lunch, an email about urgent quarterly budget revisions triggered mild anxiety. Despite the mixed emotions, I managed to unwind during a family dinner in the evening, which brought a sense of balance.",
//           record_date: new Date(),
//           insights: {
//             emotional_dynamics:
//               "Sharp mood elevation in the morning followed by a moderate dip in the afternoon",
//             key_triggers: [
//               "Positive: Career advancement notification",
//               "Negative: Financial responsibility pressure",
//             ],
//             physical_reactions: {
//               morning: "Increased energy levels (noted at 10:15 AM)",
//               afternoon: "Brief tension headache (around 4:30 PM)",
//             },
//             coping_effectiveness: {
//               successful: "Sharing news with colleagues (reinforced joy)",
//               unsuccessful: "Compulsively checking emails (amplified anxiety)",
//             },
//             behavioral_patterns: {
//               productivity: "Focused work in the morning (3h deep work)",
//               social_interaction: "Initiated 2 meaningful conversations",
//             },
//             recommendations: [
//               "Celebration: Schedule a team lunch to acknowledge achievement",
//               "Stress management: Practice box breathing before high-stakes meetings",
//               "Future planning: Allocate 30min daily for financial planning to reduce anxiety triggers",
//             ],
//           },
//         });
//       }

//       setAudioBlob(null);
//       setRecordTime(0);
//       resetRecorder();
//     } catch (error) {
//       console.error("Error during processing:", error);
//       alert("Error during processing:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }
// };
