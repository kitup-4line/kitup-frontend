import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getDashboardSummary } from "@/features/dashboard/api/dashboard";
import "./DashboardSummary.css";
import info_icon from "@/images/Dashboard/info_icon.svg";

const DashboardSummary = ({ refreshKey }) => {
  const { testId } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchSummary = async () => {
      try {
        const result = await getDashboardSummary(testId);

        if (!active) return;

        setSummary(result.data);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "핵심 지표를 불러오지 못했습니다.");
        }
      }
    };

    if (testId) fetchSummary();

    return () => {
      active = false;
    };
  }, [testId, refreshKey]);

  const summaryData = summary
    ? [
        {
          title: "완료 주문",
          value: summary.completed_order_count,
          unit: "건",
        },
        {
          title: "완료 매출",
          value: summary.completed_sales_amount,
          unit: "원",
        },
        {
          title: "추정 총공헌이익",
          value: summary.total_contribution_margin,
          unit: "원",
          highlight: true,
        },
        {
          title: "평균 건당 공헌이익",
          value: summary.average_contribution_margin,
          unit: "원",
        },
      ]
    : [];

  return (
    <div className="DashboardSummary_wrap">
      {!summary && !error && <p>핵심 지표를 불러오는 중입니다.</p>}
      {error && <p role="alert">{error}</p>}
      <div className="dashboardsummary_main">
        {summaryData.map((item) => (
          <div className="d_s_card" key={item.title}>
            <p>{item.title}</p>
            <div
              className={item.highlight ? "d_s_value highlight" : "d_s_value"}
            >
              <strong>
                {item.value == null
                  ? "-"
                  : item.value
                      .toLocaleString("ko-KR")
                      .split(",")
                      .map((group, index, groups) => (
                        <span className="d_s_number_group" key={index}>
                          {group}
                          {index < groups.length - 1 ? (
                            ","
                          ) : (
                            <span className="d_s_unit">{item.unit}</span>
                          )}
                        </span>
                      ))}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {summary?.fixed_cost_applied === false && (
        <p className="dashboardsummary_notice">
          <img src={info_icon} alt="" />
          완료 주문 및 입력된 변동비를 기준으로 산출되었으며, 추가 비용은 아직
          반영되지 않았습니다.
        </p>
      )}
    </div>
  );
};

export default DashboardSummary;
