import { useNavigate } from "react-router";
import "./HeaderLayout.css";
import homeIcon from "@/images/CommonComponents/home_icon.svg";

// showHomeButton: 홈(/tests) 화면처럼 홈 버튼이 필요 없는 곳에서는 false로 넘긴다.
const HeaderLayout = ({ showHomeButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="HeaderLayout_wrap">
      <p>KITUP</p>
      {showHomeButton && (
        <div className="header_icon">
          <img
            src={homeIcon}
            alt="KITUP 로고"
            onClick={() => navigate("/tests")}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderLayout;
