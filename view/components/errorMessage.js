import React from 'react';

const ErrorMessage = ({message}) => {
	return <div className="alert alert-danger errorMsg"> {message} </div>
};

export default ErrorMessage;