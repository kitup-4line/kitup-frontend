import "./MenuBasicForm.css";
import drop_icon from "@/images/Onboarding/drop_icon.svg";

const MenuBasicForm = ({ menuInfo, setMenuInfo, isEditable }) => {
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
              type="text"
              maxLength={30}
              value={menuInfo.menuName}
              disabled={!isEditable}
              onChange={(e) =>
                setMenuInfo((prev) => ({
                  ...prev,
                  menuName: e.target.value,
                }))
              }
            />
          </div>

          <div className="m_m_t_2">
            <p>
              예상 판매가 <span>*</span>
            </p>
            <div className="m_m_t_2_box">
              <input
                type="number"
                min="1"
                step="1"
                value={menuInfo.sellingPrice}
                disabled={!isEditable}
                onChange={(e) =>
                  setMenuInfo((prev) => ({
                    ...prev,
                    sellingPrice: e.target.value,
                  }))
                }
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
                type="number"
                min="0"
                placeholder="입력해 주세요"
                value={menuInfo.packagingCost}
                disabled={!isEditable}
                onChange={(e) =>
                  setMenuInfo((prev) => ({
                    ...prev,
                    packagingCost: e.target.value,
                  }))
                }
              />
              <p>원 (KRW)</p>
            </div>
          </div>

          <div className="m_m_b_2">
            <p>운영 시간대</p>
            <div className="m_m_b_2_box">
              <select name="" id="" defaultValue="" disabled={!isEditable}>
                <option value="" disabled hidden></option>
                <option value="점심·저녁 상시 운영 (11:00 ~ 21:00)">
                  점심·저녁 상시 운영 (11:00 ~ 21:00)
                </option>
              </select>
              <img src={drop_icon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBasicForm;
