import { useEffect, useState } from "react";
import { getTestDetail } from "@/features/cost/api/menuTests";
import { Outlet, useNavigate, useParams } from "react-router";
import { importSampleOrders } from "@/features/dashboard/api/dashboard";
import DashboardSummary from "@/features/dashboard/components/DashboardSummary";
import DashboardTabs from "@/features/dashboard/components/DashboardTabs";
import "./DashboardLayout.css";
import update_icon from "@/images/Dashboard/update_icon.svg";
import edit_icon from "@/images/Dashboard/edit_icon.svg";

function DashboardLayout() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [testInfo, setTestInfo] = useState(null);
  const [testError, setTestError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const hasImported = Boolean(testInfo?.started_at);

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchTestDetail = async () => {
      try {
        const result = await getTestDetail(testId);

        if (!active) return;
        setTestInfo(result.data);
      } catch (err) {
        if (active) {
          setTestError(err.message || "테스트 정보를 불러오지 못했습니다.");
        }
      }
    };

    fetchTestDetail();

    return () => {
      active = false;
    };
  }, [testId]);

  const formatDate = (value) =>
    new Date(value)
      .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
      .replace(/\.\s*/g, ".")
      .replace(/\.$/, "");

  const periodText = testInfo?.started_at
    ? `${formatDate(testInfo.started_at)} ~ ${formatDate(
        new Date(new Date(testInfo.started_at).getTime() + 13 * 86400000),
      )}`
    : "운영 전";

  const handleImport = async () => {
    if (!testId || !testInfo || hasImported || isImporting) return;

    setIsImporting(true);
    setImportError("");

    try {
      const result = await importSampleOrders(testId);

      setTestInfo((prev) => ({
        ...prev,
        status: result.data.status,
        started_at: result.data.started_at,
        kitchen_name: result.data.kitchen_name,
      }));

      setRefreshKey((prev) => prev + 1);
      setIsImportModalOpen(false);
    } catch (err) {
      if (err.code === "already_imported") {
        try {
          const result = await getTestDetail(testId);
          setTestInfo(result.data);
          setRefreshKey((prev) => prev + 1);
          setIsImportModalOpen(false);
        } catch (reloadError) {
          setImportError(reloadError.message);
        }
      } else {
        setImportError(err.message || "데이터 불러오기에 실패했습니다.");
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="DashboardLayout_wrap">
      <div className="dashboardlayout_top">
        <div className="d_t_title">
          <p>운영 대시보드</p>
          <span>
            {testInfo?.menu_name ||
              (testError ? "테스트 정보 조회 실패" : "불러오는 중...")}
          </span>
          <div className="d_t_title_txt">
            <p>{periodText}</p>
            <p>{testInfo?.kitchen_name || "공유주방 미지정"}</p>
          </div>
        </div>
      </div>

      <div className="dashboardlayout_buttons">
        <button
          className="d_l_load"
          type="button"
          onClick={() => {
            setImportError("");
            setIsImportModalOpen(true);
          }}
          disabled={!testInfo || isImporting || hasImported}
        >
          <img src={update_icon} alt="" />
          {isImporting
            ? "불러오는 중..."
            : hasImported
              ? "불러오기 완료"
              : "데이터 불러오기"}
        </button>
        <button
          type="button"
          onClick={() =>
            navigate(`/tests/${testId}/dashboard/cost/ingredients`)
          }
        >
          <img src={edit_icon} alt="" />
          원가 수정하기
        </button>
      </div>

      {testError && <p role="alert">{testError}</p>}

      <DashboardSummary refreshKey={refreshKey} />

      <DashboardTabs />

      <div className="dashboardlayout_main">
        <Outlet context={{ refreshKey }} />
      </div>

      <div className="dashboardlayout_finish">
        <div className="dashboardlayout_finish_text">
          <p>테스트를 종료하시겠습니까?</p>
          <span>
            종료 후에는 판매 내역을 추가로 입력하거나 수정할 수 없으며,
            현재까지의 데이터로 분석 리포트가 제공됩니다.
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}/dashboard/cost/fixed-cost`)}
        >
          테스트 종료하기
        </button>
      </div>

      {isImportModalOpen && (
        <div className="importmodal_overlay">
          <div
            className="importmodal_box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="importmodal_title"
          >
            <h2 id="importmodal_title" className="importmodal_title">
              가상 데이터 불러오기
            </h2>

            <p className="importmodal_description">
              다음 데이터를 분석 대상으로 등록하시겠습니까?
            </p>

            <div className="importmodal_info">
              <div>
                <span>주문</span>
                <p>60건 (배달/픽업 혼합)</p>
              </div>
              <div>
                <span>리뷰</span>
                <p>약 48건</p>
              </div>
            </div>

            <p className="importmodal_notice">
              등록 후 '운영 대시보드'에서 바로 분석을 시작할 수 있습니다.
            </p>

            {importError && <p role="alert">{importError}</p>}

            <div className="importmodal_buttons">
              <button
                className="importmodal_cancel"
                type="button"
                disabled={isImporting}
                onClick={() => setIsImportModalOpen(false)}
              >
                취소
              </button>

              <button
                className="importmodal_confirm"
                type="button"
                disabled={isImporting}
                onClick={handleImport}
              >
                {isImporting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
