export const resizeWindow = () => {
	return{
		type: 'WINDOW_REIZE'
	};
};

export const toggleSideBar = () => {
	return{
		type: 'TOGGLE_SIDEBAR'
	};
};

export const autoFollowChoice = (choice) => {
	return {
		type: 'FOLLOW_TYPE',
		choice
	}
}

export const feedbackSubmit = () => {
	return {
		type: 'FEEDBACK_SUBMIT'
	}
}

export const getStat = (allCampaginCount, allFollowCount, allUnfollowCount, igCount) => {
	return {
		type: "GET_STAT",
		allCampaginCount, 
		allFollowCount, 
		allUnfollowCount, 
		igCount
	}
}
