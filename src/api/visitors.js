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
