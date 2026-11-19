import { useState } from "react";
import "./MenuBasicForm.css";
import drop_icon from "@/images/Onboarding/drop_icon.svg";

const formatNumber = (value) => {
  if (value === "" || value == null) return "";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MenuBasicForm = ({
  menuInfo,
  setMenuInfo,
  businessHourOptions = [],
  isEditable,
  menuNameInputRef,
  menuNameError,
  clearMenuNameError,
  sellingPriceInputRef,
  sellingPriceError,
  clearSellingPriceError,
  businessHoursTriggerRef,
  businessHoursError,
  clearBusinessHoursError,
}) => {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");
  const [hoursError, setHoursError] = useState("");

  const handleOpenHours = () => {
    if (!isEditable) return;

    if (!isHoursOpen) {
      setTempStartTime(menuInfo.businessStartTime);
      setTempEndTime(menuInfo.businessEndTime);
      setHoursError("");
    }

    setIsHoursOpen((prev) => !prev);
  };

  const handleApplyHours = () => {
    if (!tempStartTime || !tempEndTime) {
      setHoursError("시작 시간과 종료 시간을 모두 선택해 주세요.");
      return;
    }

    if (tempEndTime <= tempStartTime) {
      setHoursError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    setMenuInfo((prev) => ({
      ...prev,
      businessStartTime: tempStartTime,
      businessEndTime: tempEndTime,
    }));

    setHoursError("");
    setIsHoursOpen(false);
    if (businessHoursError) clearBusinessHoursError();
  };

  return (
    <div className="MenuBasicForm_wrap">
      <div className="menubasicform_top">
        <p>기본 정보 입력</p>
        <span>
          메뉴명과 예상 판매가를 입력하여 마진 분석의 기준을 설정합니다.
        </span>
      </div>
      <div className="menubasicform_main">
        <div className="m_m_top">
          <div className="m_m_t_1">
            <p>
              메뉴명 <span>*</span>
            </p>
            <input
              ref={menuNameInputRef}
              type="text"
              maxLength={30}
              className={menuNameError ? "input-error" : ""}
              value={menuInfo.menuName}
              disabled={!isEditable}
              onChange={(e) => {
                setMenuInfo((prev) => ({
                  ...prev,
                  menuName: e.target.value,
                }));
                if (menuNameError) clearMenuNameError();
              }}
            />
            {menuNameError && (
              <p className="menubasicform_error" role="alert">
                메뉴명을 입력해 주세요.
              </p>
            )}
          </div>

          <div className="m_m_t_2">
            <p>
              예상 판매가 <span>*</span>
            </p>
            <div
              className={`m_m_t_2_box ${sellingPriceError ? "input-error" : ""}`}
            >
              <input
                ref={sellingPriceInputRef}
                type="text"
                inputMode="numeric"
                value={formatNumber(menuInfo.sellingPrice)}
                disabled={!isEditable}
                onChange={(e) => {
                  setMenuInfo((prev) => ({
                    ...prev,
                    sellingPrice: e.target.value.replace(/\D/g, ""),
                  }));
                  if (sellingPriceError) clearSellingPriceError();
                }}
              />
              <p>원 (KRW)</p>
            </div>
          </div>
        </div>

        <div className="m_m_bot">
          <div className="m_m_b_1">
            <p>포장비</p>
            <div className="m_m_b_1_box">
              <input
                type="text"
                inputMode="numeric"
                placeholder="입력해 주세요"
                value={formatNumber(menuInfo.packagingCost)}
                disabled={!isEditable}
                onChange={(e) =>
                  setMenuInfo((prev) => ({
                    ...prev,
                    packagingCost: e.target.value.replace(/\D/g, "") || "0",
                  }))
                }
              />
              <p>원 (KRW)</p>
            </div>
          </div>

          <div className="m_m_b_2">
            <p>운영 시간대</p>

            <div
              className={`m_m_b_2_box ${businessHoursError ? "input-error" : ""}`}
            >
              <button
                ref={businessHoursTriggerRef}
                type="button"
                className="business-hours-trigger"
                onClick={handleOpenHours}
                disabled={!isEditable}
                aria-expanded={isHoursOpen}
              >
                {menuInfo.businessStartTime && menuInfo.businessEndTime
                  ? `${menuInfo.businessStartTime} ~ ${menuInfo.businessEndTime}`
                  : "운영 시간대를 선택해 주세요"}
              </button>
              <img src={drop_icon} alt="" />
            </div>

            {isHoursOpen && (
              <div className="business-hours-dropdown">
                <div className="business-hours-columns">
                  <div className="business-hours-column">
                    <p>시작 시간</p>
                    <div className="business-hours-options">
                      {businessHourOptions.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={
                            tempStartTime === time
                              ? "hours-option selected"
                              : "hours-option"
                          }
                          onClick={() => {
                            setTempStartTime(time);
                            setHoursError("");
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="business-hours-column">
                    <p>종료 시간</p>
                    <div className="business-hours-options">
                      {businessHourOptions.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={
                            tempEndTime === time
                              ? "hours-option selected"
                              : "hours-option"
                          }
                          onClick={() => {
                            setTempEndTime(time);
                            setHoursError("");
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {hoursError && <p role="alert">{hoursError}</p>}

                <div className="business-hours-actions">
                  <button type="button" onClick={handleApplyHours}>
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBasicForm;
