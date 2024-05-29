import React from "react";

const FloatingToolbarSuggestions = ({ suggestions, position, onSelectSuggestion }) => {
  if (!suggestions.length) return null;

  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div key={index} onClick={() => onSelectSuggestion(suggestion)}>
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default FloatingToolbarSuggestions;
