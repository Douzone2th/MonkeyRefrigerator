import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";
import "./SignUp.css";
import BirthPick, { yoon } from "./DatePicker";
import { Button } from "react-bootstrap";
import { baseUrl } from "../../api/BaseUrl";
import axios from "axios";
import {
  userInformation,
  handleLogin,
  pwChange,
  updateUserInfo,
} from "../../store/actions/UserAction";
import Loading from "../shared/CustomLoading";
import { logout } from "../Header";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import "./Profile.css";
import { useCookies } from "react-cookie";
import moment from "moment";

//icon
import checkicon from "../../assets/icon/outline_check_circle_black_24dp.png";
import cancelicon from "../../assets/icon/outline_highlight_off_black_24dp.png";
import trashIcon from "../../assets/icon/trash.png";
import { useSelect } from "@mui/base";

const ProfileBody = (props) => {
  const [userInfo, setUserInfo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(props.token);

  const [nicknameCheck, setNicknameCheck] = useState(-1);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [jobId, setJobId] = useState();
  const [birthday, setBirthday] = useState(new Date());
  const tokenStore = useSelector((state) => state.tokenReducer.token);

  const nicknameInput = useRef();

  const birthDatePick = (date) => {
    setBirthday(date);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (tokenStore !== undefined) setToken(props.token);
  });
  useEffect(() => {
    setTimeout(() => {
      setUserInfo(props.data[0]);
    }, 150);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setEmail(userInfo.email);
      setNickname(userInfo.nickname);
      setGender(userInfo.gender);
      setBirthday(userInfo.birthday);
      setJobId(userInfo.jobId);
    }, 500);
  }, [userInfo]);

  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
  };

  const onChangeJobId = (e) => {
    setJobId(e.target.value);
  };

  const handleModal = (type) => {
    switch (type) {
      case "OPEN":
        setModalOpen(true);
        return;
      case "CLOSE":
      default:
        setModalOpen(false);
        return;
    }
  };

  const onClickIdChk = (type) => {
    let typedata;
    if (type == "nickname") {
      if (nickname == null || nickname == "") {
        alert("??????????????? ??????????????????.");
        nicknameInput.current.focus();
        return;
      }
      typedata = nickname;
    }

    // ?????? ????????? ???????????? axios api
    async function check(typedata) {
      if (nickname == userInfo.nickname) {
        setNicknameCheck(2); //2 : ?????? ???????????? ??????
      } else {
        const idDoubleChk = (typedata) => {
          const result = axios
            .get(`${baseUrl}idChk`, {
              params: { id: typedata, type: type },
            })
            .then((count) => {
              if (type == "nickname") {
                if (count.data.result[0].cnt == 0) {
                  setNicknameCheck(0);
                } else if (count.data.result[0].cnt > 0) {
                  setNicknameCheck(1);
                  if (nickname === userInfo.nickname) {
                    setNicknameCheck(2); //2 : ?????? ???????????? ??????
                  }
                }
              }
              return count;
            });

          return result;
        };

        let result = await idDoubleChk(typedata);
        return result;
      }
    }
    check(typedata);
  };

  function iconRerender(type) {
    if (type == "nickname") {
      if (nicknameCheck == 0) {
        return <img src={checkicon} alt="images" />;
      } else if (nicknameCheck == 1) {
        return <img src={cancelicon} alt="images" />;
      }
    }
  }

  const updateUserSubmit = () => {
    if (isSubmit()) {
      var formData = {
        data: {
          id: userInfo.id,
          nickname: nickname,
          gender: gender,
          jobId: jobId,
          birthday: moment(birthday).format("YYYYMMDD"),
        },
        token: token,
      };

      dispatch(updateUserInfo(formData));
    }
  };

  function isSubmit() {
    if (!nickname) {
      alert("???????????? ??????????????????.");
      nicknameInput.current.focus();
      return false;
    }
    if (!jobId) {
      alert("????????? ??????????????????.");
      nicknameInput.current.focus();
      return false;
    }
    if (nicknameCheck != 0) {
      if (nickname != userInfo.nickname) {
        alert("????????? ??????????????? ????????????.");
        return false;
      }
    }
    return true;
  }

  return (
    <>
      <div>
        <PasswordModal
          open={modalOpen}
          close={() => handleModal("CLOSE")}
          token={token}
        />
      </div>
      <div id="signup_content">
        {!userInfo ? (
          <div style={{ marginTop: "150px" }}>
            <Loading />
          </div>
        ) : (
          <Card>
            <CardContent>
              <h2>{userInfo.name ? userInfo.name : "?????? ??????"}</h2>
              <div className="profile_imgdiv">
                <img
                  class="profile_img"
                  src="https://usertradersbucket.s3.ap-northeast-2.amazonaws.com/basic/ic_profile_gray.png"
                />

                <div className="profile_imgtext">????????? ?????? ?????????</div>
              </div>
              <div className="account_content">
                <h3>
                  <label for="id">ID(Email)</label>
                </h3>
                <div class="pwchk">
                  <div class="box_pwchk">
                    <span class="box int_pw">
                      <input
                        type="text"
                        id="idEamil"
                        class="int"
                        value={email}
                        maxlength="20"
                        disabled
                      />
                    </span>
                  </div>
                </div>
                <h3>
                  <label for="pw">????????????</label>
                  <Button
                    onClick={() => handleModal("OPEN")}
                    variant="outline-dark"
                  >
                    ??????
                  </Button>
                </h3>

                <h3>
                  <label for="nickName">?????????</label>
                </h3>
                <div class="pwchk">
                  <div class="box_pwchk">
                    <span class="box int_pw">
                      <input
                        type="text"
                        class="int"
                        maxlength="20"
                        value={nickname}
                        onChange={onChangeNickname}
                        required
                      />
                    </span>
                  </div>
                  <div class="doublechk">
                    <Button
                      variant="warning"
                      onClick={() => {
                        onClickIdChk("nickname");
                      }}
                    >
                      ????????????
                    </Button>
                    {iconRerender("nickname")}
                  </div>
                </div>
                <h3>
                  <label for="gender">??????</label>
                </h3>
                <div class="box_id">
                  <div class="genderCheck">
                    <input
                      type="radio"
                      id="gender"
                      name="gender"
                      value="m"
                      checked={gender === "m"}
                      onChange={onChangeGender}
                    />
                    <label for="gender">??????</label>
                    <input
                      type="radio"
                      id="gender"
                      name="gender"
                      value="w"
                      checked={gender === "w"}
                      onChange={onChangeGender}
                    />
                    <label for="gender">??????</label>
                  </div>
                </div>
                <h3>
                  <label for="job">??????</label>
                </h3>
                <div class="box_id">
                  <select
                    class="signupList"
                    name="jobList"
                    onChange={onChangeJobId}
                    required
                  >
                    <option value="0">--??????--</option>
                    <option value="1" selected={jobId == 1 ? true : false}>
                      ??????
                    </option>
                    <option value="2" selected={jobId == 2 ? true : false}>
                      ??????
                    </option>
                    <option value="3" selected={jobId == 3 ? true : false}>
                      ??????
                    </option>
                    <option value="4" selected={jobId == 4 ? true : false}>
                      ?????????
                    </option>
                    <option value="5" selected={jobId == 5 ? true : false}>
                      ??????
                    </option>
                    <option value="6" selected={jobId == 6 ? true : false}>
                      ??????
                    </option>
                  </select>
                </div>
                <h3>
                  <label for="birth">????????????</label>
                </h3>
                <div class="box_id">
                  <BirthPick
                    birthday={birthday}
                    setBirthday={birthDatePick}
                    type="profile"
                  />
                </div>
              </div>
            </CardContent>
            <div class="btn_submt">
              <Button variant="success" onClick={updateUserSubmit}>
                ??????
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProfileBody;

const PasswordModal = (props) => {
  const dispatch = useDispatch();

  const { open, close, header, userId, token } = props;

  const [modalStyle, setModalStyle] = useState("none");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [pwRegexCheck, setPwRegexCheck] = useState(false); //???????????? ????????? ??????
  const [passwordError, setPasswordError] = useState(false);

  const onChangePassword = (e) => {
    setPw(e.target.value);
  };

  const onChangePasswordChk = (e) => {
    setPasswordError(e.target.value !== pw);
    setPwCheck(e.target.value);
  };

  //???????????? ????????? ??????
  useEffect(() => {
    setPwRegexCheck(isPw(pw));
  }, [pw]);

  const pwSubmit = () => {
    if (!pw) {
      alert("??????????????? ??????????????????.");
      return false;
    }
    if (!pwCheck) {
      alert("???????????? ???????????? ??????????????????.");
      return false;
    }
    if (!pwRegexCheck) {
      alert("??????????????? ????????? ?????? ????????????.");
      return;
    }

    let formData = {
      password: pw,
      token: token,
    };

    dispatch(pwChange(formData));
  };

  //???????????? ????????? ??????(8??? ??????, ??????, ??????, ???????????? ??????)
  const isPw = (password) => {
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{7,}$/;
    return pwRegex.test(password);
  };

  useEffect(() => {
    open ? setModalStyle("block") : setModalStyle("none");
  }, [open]);

  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            ???????????? ??????
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <div className="pwchange">
              {/* <button /> */}
              <TextField
                style={{ marginRight: "15px" }}
                label="Password"
                type="password"
                variant="outlined"
                helperText="??????????????? ??????????????????."
                onChange={onChangePassword}
              />
              <TextField
                style={{ marginRight: "15px" }}
                label="Password Confirm"
                type="password"
                variant="outlined"
                helperText="??????????????? ?????? ??????????????????."
                onChange={onChangePasswordChk}
              />
            </div>
          </main>
          <footer>
            <div
              style={{ display: "flex", float: "right", marginBottom: "10px" }}
            >
              {passwordError && (
                <div style={{ color: "red" }}>
                  ??????????????? ???????????? ????????????.
                </div>
              )}
              <button style={{}} type="submit" onClick={pwSubmit}>
                ??????
              </button>
            </div>
          </footer>
        </section>
      ) : null}
    </div>
  );
};
