import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { getOrders } from "@/features/dashboard/api/dashboard";
import "./OrdersTabPage.css";
import info_icon from "@/images/Dashboard/info_icon.svg";

const formatOrderTime = (value) =>
  new Date(value)
    .toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
    .replace(",", "");

const OrdersTabPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const { testId } = useParams();
  const { refreshKey } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);
  const pageStart = Math.max(1, Math.min(currentPage - 1, totalPages - 1));

  const visiblePages = Array.from(
    { length: Math.min(2, totalPages) },
    (_, index) => pageStart + index,
  );

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");
      setOrders([]);
      setCurrentPage(1);

      try {
        const result = await getOrders(testId);

        if (!active) return;

        setOrders(result.data ?? []);
      } catch (err) {
        if (active) {
          setError(err.message || "주문 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [testId, refreshKey]);

  return (
    <div className="OrdersTabPage_wrap">
      <div className="orderstabpage_top">
        <h3>주문 목록</h3>
        <span>
          <img src={info_icon} alt="" />
          완료 전 주문은 위 매출에서 제외
        </span>
      </div>

      {isLoading && <p>주문 목록을 불러오는 중입니다.</p>}
      {error && <p role="alert">{error}</p>}

      <div className="orderstabpage_table_wrap">
        <table className="orderstabpage_table">
          <thead>
            <tr>
              <th>주문</th>
              <th>주문 시간</th>
              <th>유형</th>
              <th>금액</th>
              <th>리뷰</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && !error && orders.length === 0 && (
              <tr>
                <td colSpan={5}>아직 주문 내역이 없습니다.</td>
              </tr>
            )}
            {currentOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{formatOrderTime(order.created_at)}</td>
                <td>
                  <span
                    className={`orders_type ${
                      order.order_type === "DELIVERY" ? "delivery" : "pickup"
                    }`}
                  >
                    {order.order_type === "DELIVERY" ? "배달" : "픽업"}
                  </span>
                </td>
                <td>{order.sales_amount.toLocaleString("ko-KR")}원</td>
                <td>
                  {order.review?.content ? (
                    <button
                      className="orders_review"
                      type="button"
                      onClick={() => setSelectedReview(order)}
                    >
                      리뷰 확인하기
                    </button>
                  ) : (
                    <span className="orders_review_empty">리뷰 미작성</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="orderstabpage_bot">
        <p>
          {orders.length === 0 ? 0 : startIndex + 1} -{" "}
          {startIndex + currentOrders.length} / 전체 {orders.length}개 주문 표시
        </p>

        <div className="orders_pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            이전
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              className={currentPage === page ? "selected" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
          </button>
        </div>
      </div>

      {selectedReview && (
        <div className="reviewmodal_overlay">
          <div
            className="reviewmodal_box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reviewmodal_title"
          >
            <h2 id="reviewmodal_title" className="reviewmodal_title">
              #{String(selectedReview.order_id).padStart(3, "0")} 리뷰
            </h2>

            <div className="reviewmodal_content">
              {selectedReview.review.content}
            </div>

            <button
              className="reviewmodal_close"
              type="button"
              onClick={() => setSelectedReview(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTabPage;
