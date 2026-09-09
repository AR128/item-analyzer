function ResultCard({ result }) {
  if (!result) return null;

  const statusStyles = {
    ALLOWED: {
      icon: "🟢",
      label: "ALLOWED",
      tone: "allowed",
    },
    PROHIBITED: {
      icon: "🔴",
      label: "NOT ALLOWED",
      tone: "prohibited",
    },
    CONDITIONAL: {
      icon: "🟡",
      label: "CONDITIONAL",
      tone: "conditional",
    },
  };

  const style = statusStyles[result.status] || {
    icon: "⚪",
    label: "UNKNOWN",
    tone: "unknown",
  };

  return (
    <div className={`result-card ${style.tone}`}>
      <div className="result-header">
        <div className="result-icon">{style.icon}</div>
        <h2>{style.label}</h2>
      </div>

      <div className="result-meta">
        <span>Identified item</span>
        <strong>{result.item}</strong>
      </div>

      {result.reason && (
        <div className="result-meta">
          <span>Reason</span>
          <p>{result.reason}</p>
        </div>
      )}

      {result.conditions && (
        <div className="result-meta">
          <span>Conditions</span>
          <p>{result.conditions}</p>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
