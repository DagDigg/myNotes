import { useState } from "react";

const useLoginForm = callback => {
  // Declare hooks state
  const [inputs, setInputs] = useState({});

  /**
   * Submit handler. Optionally executes callback function.
   * @param {Object} e Event object
   */
  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    callback();
  };

  /**
   * Input change handler. Sets inputs object according to event id and value
   * @param {Object} e Event object
   */
  const handleInputChange = e => {
    e.persist();
    setInputs(inputs => ({ ...inputs, [e.target.id]: e.target.value }));
  };

  // Return inputs and handlers
  return {
    inputs,
    handleSubmit,
    handleInputChange
  };
};

export default useLoginForm;
