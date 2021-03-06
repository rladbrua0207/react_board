import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserAtom } from "../atoms";
import Comment from "../Components/Comment/Comment";
import { IPost } from "../Interface";

const TableContainer = styled.table`
  margin-top: 30px;
  min-width: 700px;
  border-radius: 5px;
  border: solid 1px #8d8d8d;
  min-height: 575px;
  padding: 10px;
  border: none;
  border-top: solid 1px black;
  table-layout: fixed;
  word-break: break-all;
  border-radius: 4px;

  a {
  }
  a:hover,
  a:active {
    text-decoration: none;
  }

  tr {
    border-bottom: solid 1px ${(props) => props.theme.borderColor};
    border-collapse: collapse;
  }

  td,
  th {
    height: 20px;
  }
  th {
    background-color: #e9e9e999;

    height: 40px;
    width: 70px;
    vertical-align: middle;
  }
  td {
    padding: 10px;
    padding-top: 12px;

    font-size: 14px;
    line-height: 20px;
    width: 110px;
  }

  #content {
    height: 450px;
    white-space: pre-wrap;
    line-height: 25px;
  }
  #title {
    text-align: start;
    font-size: 1.2rem;
    padding: 5px;
    padding-left: 15px;
  }

  .table_head {
    font-size: 1.1rem;
  }
`;

const PostContainer = styled.div`
  width: 700px;
  margin: 0 auto;
`;

const PostBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const PostBtn_etc = styled.button`
  border: solid 1px ${(props) => props.theme.borderColor};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 1.1rem;
  &:hover {
    cursor: pointer;
  }
`;

function Post() {
  const state = useLocation().state as IPost;
  const navigate = useNavigate();
  const loggedInUser = useRecoilValue(loggedInUserAtom);
  const isOwner = loggedInUser.userId === state.ownerId;

  const getEditPage = () => {
    if (window.confirm(`게시물을 수정하시겠습니까?`)) {
      navigate(`edit`, { state });
    }
  };

  const handlePostDelete = () => {
    if (!window.confirm(`정말 게시물을 삭제하시겠습니까?`)) {
      return;
    }
    let posts: IPost[] = JSON.parse(localStorage.getItem("post") as string);
    const postIndex = posts.findIndex((post) => post.postId === state.postId);
    posts = [...posts.slice(0, postIndex), ...posts.slice(postIndex + 1)];
    localStorage.setItem("post", JSON.stringify(posts));

    navigate(`/board`);
  };

  return (
    <PostContainer>
      <TableContainer>
        <tbody>
          <tr>
            <th className="table_head" colSpan={4} id="title">
              {state.title}
            </th>
          </tr>
          <tr>
            <th className="table_head">작성자</th>
            <td>{state.owner}</td>
            <th className="table_head">번호</th>
            <td>{state.no}</td>
          </tr>
          <tr>
            <th className="table_head">조회수</th>
            <td>{state.views}</td>
            <th className="table_head">등록일</th>
            <td>{state.createdAt}</td>
          </tr>
          <tr id="content">
            <td colSpan={4}>{state.content}</td>
          </tr>
        </tbody>
      </TableContainer>
      {isOwner ? (
        <PostBtnContainer>
          <PostBtn_etc onClick={getEditPage}>수정</PostBtn_etc>
          <PostBtn_etc onClick={handlePostDelete}>삭제</PostBtn_etc>
        </PostBtnContainer>
      ) : (
        <></>
      )}
      <Comment></Comment>
    </PostContainer>
  );
}

export default Post;
