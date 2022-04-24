import React, { useState, useEffect, useCallback, useRef } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { mdiCartVariant, mdiHeart, mdiComment } from "@mdi/js";
import Icon from "@mdi/react";
import { mdiBookmark } from "@mdi/js";
import { mdiLeadPencil } from "@mdi/js";
import { mdiClock } from "@mdi/js";
import "./BoardCard.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function BoardCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [board, setBoard] = useState(props.item);
  useEffect(() => {}, []);

  function convertTime(time) {
    let convert = time.split("T")[0];
    return convert;
  }

  return (
    <Card className="card" sx={{ maxWidth: 345, width: 345 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={board.profileImg}>
            사진
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={board.nickname}
        subheader={convertTime(board.createAt)}
      />
      {/* boardImgPath */}

      {board.boardImgPath ? (
        <Link to={"/board/" + props.item.id}>
          <CardMedia
            component="img"
            width={"300px"}
            height={"300px"}
            src={board.boardImgPath}
          />
        </Link>
      ) : (
        <Link to={"/board/" + props.item.id}>
          <CardMedia
            component="img"
            width={"300px"}
            height={"300px"}
            src={"/monkey_2.png"}
            alt="douzone monkey"
          />
        </Link>
      )}

      <CardContent
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #d3d3d3",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            fontFamily: "BMDOHYEON",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {board.title}
        </Typography>
      </CardContent>

      <br />

      <CardActions style={{ height: "35px" }} disableSpacing>
        <Typography
          style={{
            fontFamily: "BMDOHYEON",
            fontSize: "13px",
            margin: "8px",
            borderRadius: "30px",
            padding: "3px",
            background: "#DBFFCF",
            boxShadow: "1px 1px 3px 1px #dadce0",
          }}
        >
          <Icon path={mdiBookmark} title="menu" size={1} color="orange" />

          {board.category}
        </Typography>
        <Typography
          style={{
            fontFamily: "BMDOHYEON",
            fontSize: "13px",
            margin: "8px",
            borderRadius: "30px",
            padding: "3px",
            background: "#FFDDDC",
            boxShadow: "1px 1px 3px 1px #dadce0",
          }}
        >
          <Icon path={mdiLeadPencil} title="menu" size={1} color="red" />
          {board.difficulty}
        </Typography>
        <Typography
          style={{
            fontFamily: "BMDOHYEON",
            fontSize: "10px",
            margin: "5px",
            borderRadius: "30px",
            padding: "3px",
            background: "lightyellow",
            boxShadow: "1px 1px 3px 1px #dadce0",
          }}
        >
          <Icon path={mdiClock} title="menu" size={1} color="black" />
          {board.cookTime}
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph style={{ fontFamily: "BMDOHYEON" }}>
            {board.subtitle ? board.subtitle : "부제목이 없네용"}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
