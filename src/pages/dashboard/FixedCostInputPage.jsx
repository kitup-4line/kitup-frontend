import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getTestDetail, updateTest } from "@/features/cost/api/menuTests";
import "./FixedCostInputPage.css";
import info_icon03 from "@/images/Dashboard/info_icon03.svg";
import notice_icon from "@/images/Dashboard/notice_icon.svg";

const quickAmounts = [
  { label: "+50만 원", amount: 500000 },
  { label: "+100만 원", amount: 1000000 },
  { label: "+200만 원", amount: 2000000 },
];

const FixedCostInputPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [fixedCost, setFixedCost] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(testId));
  const [isSaving, setIsSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchFixedCost = async () => {
      try {
        const result = await getTestDetail(testId);
        if (!active) return;

        const data = result.data;

        setFixedCost(
          data.additional_fixed_cost == null
            ? ""
            : String(data.additional_fixed_cost),
        );

        setIsEditable(data.is_editable);
      } catch (err) {
        if (active) {
          setLoadError(err.message || "고정비 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchFixedCost();

    return () => {
      active = false;
    };
  }, [testId]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFixedCost(value);
  };

  const handleAdd = (amount) => {
    setFixedCost(String(Number(fixedCost || 0) + amount));
  };

  const handleReset = () => {
    setFixedCost("0");
  };

  const handleSave = async () => {
    if (isLoading || isSaving || !isEditable || !testId || loadError) return;

    const amount = Number(fixedCost || 0);

    // 1. 입력값 검증
    if (!Number.isSafeInteger(amount) || amount < 0) {
      setError("고정비는 0 이상의 정수로 입력해 주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // 2. 추가 고정비 저장
      await updateTest(testId, {
        additional_fixed_cost: amount,
      });

      // 3. 저장 성공 후 이동
      navigate(`/tests/${testId}/report`, {
        state: { fixedCost: amount },
      });
    } catch (err) {
      setError(err.message || "고정비 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="FixedCostInputPage_wrap">
      <div className="fixedcostinputpage_top">
        <h2>추가 고정비 입력</h2>
        <span>
          매장 운영에 소요되는 월 고정비를 입력하여 손익 리포트에 반영하세요.
        </span>
      </div>

      <div className="fixedcostinputpage_info">
        <img src={info_icon03} alt="" />
        <div>
          <p>고정비란?</p>
          <span>
            임대료, 기본 인건비, 공과금, 통신비 등 판매량과 관계없이 매달
            일정하게 지출되는 비용입니다. 입력하신 금액은 월 단위 기준으로 분석
            리포트에 반영됩니다.
            <br />
            <span>산정 예시:</span> 매장 임대료 150만 원 + 기본 매니저 인건비
            200만 원 = 350만 원
          </span>
        </div>
      </div>

      <div className="fixedcostinputpage_main">
        <div className="f_c_m_top">
          <p>
            월 고정비 지출액 <span>(선택)</span>
          </p>
          <span>단위: 대한민국 원 (KRW)</span>
        </div>

        <div className="f_c_m_input">
          <input
            type="text"
            inputMode="numeric"
            value={
              fixedCost === "" ? "" : Number(fixedCost).toLocaleString("ko-KR")
            }
            disabled={
              isLoading || isSaving || !isEditable || Boolean(loadError)
            }
            onChange={handleChange}
            placeholder="0"
            aria-label="월 고정비 지출액"
          />
          <span>원</span>
        </div>

        <p className="f_c_m_description">
          공백이거나 0원일 경우 고정비 지출 0원으로 자동 계산됩니다.
        </p>

        <div className="f_c_m_bot">
          <div className="f_c_m_quick">
            <span>빠른 추가</span>
            {quickAmounts.map((item) => (
              <button
                type="button"
                key={item.amount}
                disabled={
                  isLoading || isSaving || !isEditable || Boolean(loadError)
                }
                onClick={() => handleAdd(item.amount)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="f_c_m_reset"
            type="button"
            onClick={handleReset}
            disabled={
              isLoading || isSaving || !isEditable || Boolean(loadError)
            }
          >
            0원으로 초기화
          </button>
        </div>
      </div>

      <div className="fixedcostinputpage_notice">
        <img src={notice_icon} alt="" />
        <div>
          <p>고정비를 모르거나 확정되지 않았나요?</p>
          <span>
            정확한 금액을 확정하지 못하셨다면 0원으로 입력해 리포트를 먼저
            생성하실 수 있습니다. 이 경우 산출된 공헌이익 총액에
            운영영업이익으로 표기되며, 추후 대시보드에서 언제든 수정 가능합니다.
          </span>
        </div>
      </div>

      {!testId && <p role="alert">테스트 ID를 확인할 수 없습니다.</p>}
      {isLoading && <p>고정비 정보를 불러오는 중입니다.</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {!isEditable && (
        <p role="alert">리포트가 생성된 테스트는 수정할 수 없습니다.</p>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="fixedcostinputpage_bot">
        <button
          className="fixedcostinputpage_cancel"
          type="button"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
        <button
          className="fixedcostinputpage_save"
          type="button"
          onClick={handleSave}
          disabled={
            isLoading ||
            isSaving ||
            !isEditable ||
            !testId ||
            Boolean(loadError)
          }
        >
          저장 및 리포트 생성 →
        </button>
      </div>
    </div>
  );
};

export default FixedCostInputPage;
