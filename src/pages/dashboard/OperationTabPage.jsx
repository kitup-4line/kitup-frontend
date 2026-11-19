import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import {
  getHourlySales,
  getDashboardChannels,
} from "@/features/dashboard/api/dashboard";
import "./OperationTabPage.css";
import info_icon_blue from "@/images/Dashboard/info_icon_blue.svg";
import calculation_icon from "@/images/Dashboard/calculation_icon.svg";

function OperationTabPage() {
  const { testId } = useParams();
  const { refreshKey } = useOutletContext();
  const [hourlyData, setHourlyData] = useState([]);
  const [peak, setPeak] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [channels, setChannels] = useState([]);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState("");

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchHourlySales = async () => {
      try {
        const result = await getHourlySales(testId);

        if (!active) return;

        setHourlyData(result.data.slots ?? []);
        setPeak(result.data.peak ?? null);
        setError("");
      } catch (err) {
        if (active) {
          setError(
            err.message || "시간대별 판매 데이터를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchHourlySales();

    return () => {
      active = false;
    };
  }, [testId, refreshKey]);

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchChannels = async () => {
      setChannelLoading(true);
      setChannelError("");
      setChannels([]);

      try {
        const result = await getDashboardChannels(testId);

        if (!active) return;

        setChannels(result.data.channels ?? []);
      } catch (err) {
        if (active) {
          setChannelError(
            err.message || "배달·픽업 비교 데이터를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (active) {
          setChannelLoading(false);
        }
      }
    };

    fetchChannels();

    return () => {
      active = false;
    };
  }, [testId, refreshKey]);

  const orderTypeData = ["PICKUP", "DELIVERY"]
    .map((type) => channels.find((channel) => channel.order_type === type))
    .filter(Boolean)
    .map((channel) => ({
      type: channel.order_type === "PICKUP" ? "픽업" : "배달",
      count: channel.order_count,
      profit: channel.contribution_margin_per_order,
      color: channel.order_type === "PICKUP" ? "blue" : "yellow",
    }));

  const pickup = channels.find((channel) => channel.order_type === "PICKUP");
  const delivery = channels.find(
    (channel) => channel.order_type === "DELIVERY",
  );

  const profitDifference =
    pickup?.contribution_margin_per_order != null &&
    delivery?.contribution_margin_per_order != null
      ? pickup.contribution_margin_per_order -
        delivery.contribution_margin_per_order
      : null;

  return (
    <div className="OperationTabPage_wrap">
      <div className="operationtabpage_left">
        <div className="o_l_top">
          <div>
            <p>시간대별 판매</p>
            <span>매출 집중 구간 및 시간대별 주문 분포</span>
          </div>
          <span className="o_l_t_label">단위: 건수</span>
        </div>

        {isLoading && <p>시간대별 판매 데이터를 불러오는 중입니다.</p>}
        {error && <p role="alert">{error}</p>}
        <div className="o_l_sales">
          <div className="o_l_sales_header">
            <span>시간대 구분</span>
            <span>주문 분포 게이지</span>
            <span>주문 건수 (비중)</span>
          </div>
          {!isLoading && !error && hourlyData.length === 0 && (
            <p>아직 주문 데이터가 없습니다.</p>
          )}

          {hourlyData.map((item) => (
            <div
              className={`o_l_sales_row ${item.is_peak ? "selected" : ""}`}
              key={item.hour}
            >
              <span>{item.label}</span>

              <div className="o_l_bar">
                <div
                  className="o_l_bar_fill"
                  style={{
                    width: `${item.ratio}%`,
                  }}
                />
              </div>

              <span>
                {item.order_count}건<span>({item.ratio}%)</span>
              </span>
            </div>
          ))}
        </div>

        {peak && (
          <div className="o_notice01">
            <img src={info_icon_blue} alt="" />
            {peak.hours.map((hour) => `${hour}~${hour + 1}시`).join(" 및 ")}에
            전체 주문의 {peak.ratio.toFixed(1)}% (총 {peak.order_count}건)가
            집중되어 있습니다.
          </div>
        )}
      </div>

      <div className="operationtabpage_right">
        <div className="o_r_top">
          <div>
            <p>배달·픽업 비교</p>
          </div>
        </div>

        {channelLoading && <p>배달·픽업 데이터를 불러오는 중입니다.</p>}
        {channelError && <p role="alert">{channelError}</p>}

        <div className="o_r_compare">
          <div className="o_r_compare_header">
            <span>유형</span>
            <span>완료 주문</span>
            <span>건당 공헌이익</span>
          </div>

          {orderTypeData.map((item) => (
            <div className="o_r_compare_row" key={item.type}>
              <div className="o_r_type">
                <span className={`o_r_circle ${item.color}`} />
                <span>{item.type}</span>
              </div>
              <span>{item.count}건</span>
              <strong>
                {item.profit == null
                  ? "-"
                  : `${item.profit.toLocaleString("ko-KR")}원`}
              </strong>
            </div>
          ))}
        </div>

        {profitDifference !== null && (
          <div className="o_notice02">
            <img src={calculation_icon} alt="" />
            {profitDifference === 0
              ? "픽업과 배달의 건당 공헌이익이 동일하게 산출되었습니다."
              : `${
                  profitDifference > 0
                    ? "픽업 주문이 배달 대비"
                    : "배달 주문이 픽업 대비"
                } 건당 공헌이익이 ${Math.abs(profitDifference).toLocaleString(
                  "ko-KR",
                )}원 더 높게 산출되었습니다.`}
          </div>
        )}
      </div>
    </div>
  );
}

export default OperationTabPage;
