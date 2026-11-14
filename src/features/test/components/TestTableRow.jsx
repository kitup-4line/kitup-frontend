import styled, { css } from "styled-components";
import { Link } from "react-router";
import { STATUS_META, TEST_STATUS } from "@/domain/testStatus";
import {
  formatDate,
  formatDDay,
  formatPeriod,
  getDaysLeft,
} from "@/shared/utils/format";
import StatusBadge from "./StatusBadge";
import store_icon from "@/images/TestList/store_icon.svg";
import calendar_icon from "@/images/TestList/calendar_icon.svg";

export default function TestTableRow({ test }) {
  const {
    test_id,
    menu_name,
    status,
    kitchen_name,
    started_at,
    ended_at,
    updated_at,
  } = test;
  const { actionLabel, getPath } = STATUS_META[status];
  const hasPeriod = Boolean(started_at && ended_at);
  const displayName = menu_name ?? "메뉴명 미입력";

  return (
    <tr>
      <NameCell title={displayName}>{displayName}</NameCell>

      <StatusCell>
        <StatusBadge status={status} />
      </StatusCell>

      <Cell>
        <InfoLine $muted={!kitchen_name}>
          <IconBox>
            <img src={store_icon} alt="" aria-hidden="true" />
          </IconBox>
          {kitchen_name ?? "매장 미지정"}
        </InfoLine>
        <InfoLine $muted>
          <IconBox>
            <img src={calendar_icon} alt="" aria-hidden="true" />
          </IconBox>
          {hasPeriod ? formatPeriod(started_at, ended_at) : "운영 기간 미설정"}
        </InfoLine>
      </Cell>

      <Cell>
        {status === TEST_STATUS.RUNNING && ended_at ? (
          <DDayBadge>{formatDDay(getDaysLeft(ended_at))}</DDayBadge>
        ) : (
          <>
            <DateText>{formatDate(updated_at)}</DateText>
            <DateText $muted>
              {status === TEST_STATUS.COMPLETED ? "테스트 종료" : "최근 수정"}
            </DateText>
          </>
        )}
      </Cell>

      <ActionCell>
        <ActionLink to={getPath(test_id)} $status={status}>
          {actionLabel}&nbsp;&nbsp;→
        </ActionLink>
      </ActionCell>
    </tr>
  );
}

const Cell = styled.td`
  padding: 12px;
  vertical-align: middle;
`;

const NameCell = styled(Cell)`
  padding: 10px 10px 10px 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #0f172a;
`;

const StatusCell = styled(Cell)`
  padding: 10px;
`;

const ActionCell = styled(Cell)`
  padding: 11px 28px 11px 12px;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.336px;
  color: ${({ $muted }) => ($muted ? "#64748b" : "#0f172a")};
  white-space: nowrap;
`;

const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 12px;
  height: 12px;

  & > img {
    max-width: none;
  }
`;

const DateText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.336px;
  color: ${({ $muted }) => ($muted ? "#64748b" : "#0f172a")};
`;

const DDayBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 11px;

  border: 1px solid #ffe4e6;
  border-radius: 4px;
  background-color: #ffe4e6;
  color: #f43f5e;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
`;

const ACTION_STYLE = {
  [TEST_STATUS.RUNNING]: css`
    border-color: #0f172a;
    background-color: #0f172a;
    color: #f8fafc;
    &:hover {
      background-color: #1e293b;
    }
  `,
  [TEST_STATUS.DRAFT]: css`
    border-color: #f4faff;
    background-color: #f4faff;
    color: #0f172a;
    &:hover {
      background-color: #e8f3ff;
    }
  `,
  [TEST_STATUS.COMPLETED]: css`
    border-color: #e2e8f0;
    background-color: #fcfeff;
    color: #0f172a;
    &:hover {
      background-color: #f1f5f9;
    }
  `,
};

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 164px;
  height: 44px;
  box-sizing: border-box;

  border: 1px solid transparent;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.336px;
  white-space: nowrap;

  ${({ $status }) => ACTION_STYLE[$status]}

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;
