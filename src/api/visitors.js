import request from "@/utils/request";

export function visitorsPage(data) {
  return request({
    url: "manage/visitors/page",
    method: "post",
    data,
  });
}

export function visitorsStatistics(data) {
  return request({
    url: "manage/visitors/statistics",
    method: "post",
    data,
  });
}

export function blacklistPage(data) {
  return request({
    url: "manage/blacklist/page",
    method: "post",
    data,
  });
}
