// import { toogleSideBar, resizeWindow } from './actions'

const initState = {
	isMobile: false,
	sideBarVisible: true,
	choice: 'SPECIFIC'
}

export const layoutReducer = (state = initState, action) => {
	switch(action.type){
		case 'WINDOW_REIZE':
		{
		    let { innerWidth } = window
		    let isMobile = innerWidth < 768
		    let smallScreen = innerWidth <= 412
		    let sideBarVisible = state.isMobile ? state.sideBarVisible : !isMobile;
		    return {
		      ...state,
		      isMobile,
		      sideBarVisible,
		      smallScreen
	    }	
    	};
	    case 'TOGGLE_SIDEBAR':
	    {
		    let sideBarVisible = !state.sideBarVisible
		    return {...state, sideBarVisible}
	  	};
	  	case 'FOLLOW_TYPE':
	  		return {...state, choice: action.choice};
	  	case 'FEEDBACK_SUBMIT':
	  		return {
	  			...state,
	  			feedback: true
	  		}
	  	case 'GET_STAT':
	  		let { allCampaginCount, allFollowCount, allUnfollowCount, igCount } = action
	  		return {
	  			...state,
	  			allCampaginCount, 
	  			allFollowCount, 
	  			allUnfollowCount, 
	  			igCount
	  		}
	  	default:
	  	 	return state;
	};
}

