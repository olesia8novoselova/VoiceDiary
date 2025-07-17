import { memo } from "react";
import RecordingListItem from "./RecordingListItem";

const RecordingsList = memo(({ recordings, expandedRecord, toggleExpandRecord }) => {
  return (
    <div className="recordings-list">
      {recordings?.length > 0 ? (
        recordings.map((recording) => (
          <RecordingListItem
            key={recording.record_id}
            recording={recording}
            isExpanded={expandedRecord === recording.record_id}
            onToggleExpand={() => toggleExpandRecord(recording.record_id)}
          />
        ))
      ) : (
        <div className="no-records">
          <p>No recordings found</p>
        </div>
      )}
    </div>
  );
});

export default RecordingsList;