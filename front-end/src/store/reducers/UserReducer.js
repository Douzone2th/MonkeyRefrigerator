//UserReducer.js
import { reducerUtils, handleAsyncActions } from '../../api/AsyncUtil';
import {
	SIGNUPFORM_INSERT,
	USERINFORMATION_GET,
	USERINFORMATION_GET_SUCCESS,
	USERINFORMATION_GET_ERROR,
	USERMATERIAL_GET,
	USERMATERIAL_GET_SUCCESS,
	USERMATERIAL_GET_ERROR,
} from '../actions/UserAction';

const initialState = {
	userInformation: reducerUtils.initial(),
	userMaterialList: reducerUtils.initial(),
};
export default function UserReducer(state = initialState, action) {
	switch (action.type) {
		case SIGNUPFORM_INSERT:
			return state;
		case USERINFORMATION_GET:
		case USERINFORMATION_GET_SUCCESS:
		case USERINFORMATION_GET_ERROR:
			return handleAsyncActions(USERINFORMATION_GET, 'userInformation')(
				state,
				action
			);
		case USERMATERIAL_GET:
		case USERMATERIAL_GET_SUCCESS:
		case USERMATERIAL_GET_ERROR:
			return handleAsyncActions(USERMATERIAL_GET, 'userMaterialList')(
				state,
				action
			);
		default:
			return state;
	}
}
