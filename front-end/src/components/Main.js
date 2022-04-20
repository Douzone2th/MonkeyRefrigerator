//Main.js
//Install
import React, { useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//Style
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import gsap from "gsap";
import dungdunglogo from "../assets/monkey_2.png";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./Main.css";
//User
import { Login } from "./user/Login";
import SignUp from "./user/SignUp";
import { handleLogin } from "../store/actions/UserAction";
import PublicRoute from "./user/PublicRoute";
import PrivateRoute from "./user/PrivateRoute";
import Header from "./Header";
import BoardDetail from "./board/BoardDetail";
import Profile from "./user/Profile";
import { Refrigerator } from "./search/Refrigerator";
import { boardList } from "../store/actions/BoardAction";
import BoardList from "./board/BoardList";
import BoardCreate from "./board/BoardCreate";

export default function Main() {
  const dispatch = useDispatch();
  const tokenReducer = useSelector((state) => state.tokenReducer.token);
  useEffect(() => {
    if (tokenReducer === null) dispatch(handleLogin());
  });

  return (
    <>
      <Header />
      <div className="mainContainer">
        <Switch>
          <PublicRoute restricted={false} exact path="/">
            <MainPage />
          </PublicRoute>
          <PublicRoute
            restricted={true}
            component={Login}
            path="/login"
            exact
          />
          <PublicRoute
            restricted={true}
            component={SignUp}
            path="/signup"
            exact
          />
          <PrivateRoute component={Profile} path="/profile" exact />
          <PublicRoute
            restricted={false}
            component={BoardList}
            path="/board"
            exact
          />
          <PublicRoute component={BoardCreate} path="/create" exact />
          <PrivateRoute component={Refrigerator} path="/refrigerator" exact />
          <Route path="/board/:id">
            <BoardDetail />
          </Route>
        </Switch>
      </div>
    </>
  );
}

const MainLogo = (
  <div className="dung">
    <img src={dungdunglogo} alt="dungdung" />
  </div>
);

const MainVoteCard = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
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
  return (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          이주의 레시피
        </Typography>
        <Typography variant="h5" component="div">
          이번주의 레시피를 투표해주세요!
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Pick Me!
        </Typography>
        <Typography variant="body2">
          투표해 주신 분들 중 10분을 추첨해서 상품을 드립니다!
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleModal("OPEN")}>
          Learn More
        </Button>
      </CardActions>
      <VoteModal
        open={modalOpen}
        close={() => handleModal("CLOSE")}
        header="이주의 레시피!"
      >
        <VotePage data={props.data} />
      </VoteModal>
    </React.Fragment>
  );
};
const VoteModal = (props) => {
  const { open, close, header } = props;

  return (
    <div className={open ? "openModal voteModal" : "voteModal"}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="voteClose" onClick={close}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="voteClose" onClick={close}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};
const VotePage = (props) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 5;
  useEffect(() => {
    setRows([...props.data]);
  }, []);
  return (
    <div className="votePage">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell align="right">제목</TableCell>
              <TableCell align="right">작성자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(offset, offset + 5).map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.nickname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination total={rows.length} limit={5} page={page} setPage={setPage} />
    </div>
  );
};
const Pagination = ({ total, limit, page, setPage }) => {
  const numPages = Math.ceil(total / limit);
  return (
    <>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        &lt;
      </Button>
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <Button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : <></>}
          >
            {i + 1}
          </Button>
        ))}
      <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
        &gt;
      </Button>
    </>
  );
};
const RankCard = (props) => {
  return (
    <>
      <Card
        sx={{ height: 300, width: 200, margin: "10px", textAlign: "center" }}
      >
        <img
          style={{ width: "auto", height: "200px" }}
          src={props.path}
          alt="img"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            style={{ fontSize: "15px" }}
          >
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.content}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
const SkeletonLoadingSet = () => {
  return (
    <div className="skeletonSet">
      <SkeletonLoading />
      <SkeletonLoading />
      <SkeletonLoading />
      <SkeletonLoading />
      <SkeletonLoading />
    </div>
  );
};
const SkeletonLoading = () => {
  return (
    <div style={{ width: "200px", margin: "10px" }}>
      <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      />
      <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      />
      <Skeleton animation="wave" height={10} width="40%" />
      <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
      <Skeleton animation="wave" height={10} width="80%" />
    </div>
  );
};
const MainPage = () => {
  const dispatch = useDispatch();
  const [modalOn, setModalOn] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const offset = (page - 1) * 5;
  const boardReducer = useSelector((state) => state.boardReducer);
  const [boardRank, setBoardRank] = useState([]);
  const [imgPath, setImgPath] = useState([]);
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { y: 0, opacity: 1 },
      {
        y: -100,
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "Power1.out",
      }
    );
  });
  useEffect(() => {
    const setBoard = async () => {
      setLoading(true);
      await dispatch(boardList());
      setLoading(false);
    };
    setBoard();
  }, []);

  useEffect(() => {
    if (boardReducer.boardList.data)
      setBoardRank([...boardReducer.boardList.data.data.result]);
  }, [boardReducer.boardList.data]);
  return (
    <>
      <div className="mainHeadLine">
        <div className="dungdung" ref={logoRef}>
          {MainLogo}
        </div>
        <div className="mainVote">
          <Card
            variant="outlined"
            onClick={() => {
              modalOn ? setModalOn(false) : setModalOn(true);
            }}
          >
            <MainVoteCard data={boardRank} />
          </Card>

          <VoteModal flag={modalOn} />
        </div>
      </div>
      {loading ? (
        <div className="loadingMain">
          <SkeletonLoadingSet />
        </div>
      ) : (
        <>
          <div className="mainBody">
            <div className="mainBodyTitle" style={{ marginLeft: "20%" }}>
              <h4>Best 10 Recipe</h4>
            </div>
            <div className="mainBodyCon">
              {boardRank.slice(offset, offset + 5).map((item, i) => (
                <RankCard
                  path={boardRank[i].boardImgPath}
                  title={boardRank[i].title}
                  content={boardRank[i].content}
                />
              ))}
            </div>
            <div className="mainBodyCon">
              <Pagination
                total={boardRank.length}
                limit={5}
                page={page}
                setPage={setPage}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
