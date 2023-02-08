import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { Comments } from "../types/comments";

interface Comment {
  _id: number;
  comments?: Comments[];
  open: boolean[];
  handleDeleteComment: (postID: number, commentID: number) => void;
}

const SingleComment = ({
  _id,
  comments,
  open,
  handleDeleteComment,
}: Comment) => {
  const { user } = useSelector((state: RootState) => state);

  return (
    <>
      {open[_id]
        ? comments?.map((cmnt: Comments) => {
            return (
              <div
                key={cmnt._id}
                className="flex w-full items-center py-1 justify-between"
              >
                <div className="flex items-center">
                  <img
                    className="h-4 w-4 mr-2 rounded-full"
                    src={
                      cmnt.postedBy.photoUrl
                        ? cmnt.postedBy.photoUrl
                        : "https://cdn-icons-png.flaticon.com/512/17/17004.png"
                    }
                    alt="user"
                  />
                  <Link to={`/profile/${cmnt.postedBy._id}`}>
                    <h6 key={cmnt._id}>
                      <span style={{ fontWeight: "500" }}>
                        {cmnt.postedBy.name}
                      </span>{" "}
                      {cmnt.text}
                    </h6>
                  </Link>
                </div>
                <div>
                  {cmnt.postedBy._id === user?._id && (
                    <AiFillDelete
                      title="Delete a comment"
                      className="cursor-pointer"
                      onClick={() => handleDeleteComment(_id, cmnt._id)}
                    />
                  )}
                </div>
              </div>
            );
          })
        : ""}
    </>
  );
};

export default SingleComment;
