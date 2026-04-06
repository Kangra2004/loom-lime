import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  return (
    <div style={{ color: "#f5b50a" }}>
      {[1,2,3,4,5].map((star) =>
        star <= rating ? <FaStar key={star}/> : <FaRegStar key={star}/>
      )}
    </div>
  );
};

export default StarRating;