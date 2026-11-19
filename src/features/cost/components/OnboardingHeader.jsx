import "./OnboardingHeader.css";

const OnboardingHeader = ({ title, description }) => {
  return (
    <div className="OnboardingHeader_wrap">
      <p>{title}</p>
      <span>{description}</span>
    </div>
  );
};

export default OnboardingHeader;
