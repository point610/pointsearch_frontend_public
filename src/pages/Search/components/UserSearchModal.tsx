import '@umijs/max';
import { Avatar, Card, Divider, List } from 'antd';

import { listUserVOByPageUsingPOST } from '@/services/pointsearch_backend/userController';
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useReducer, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {searchAllUsingPOST} from "@/services/pointsearch_backend/searchController";

export type Props = {
  values: string;
};

const UserSearchModal: React.FC<Props> = (props) => {
  const { values } = props;
  const [dataList, setDataList] = useState<API.UserVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tempList, setTempList] = useState<API.PostVO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  /**
   * 滚动翻页时的方法
   */
  const fetchData = () => {
    setLoading(true);

    const query: API.SearchRequest = {
      current: currentPage,
      pageSize: pageSize,
      searchText: values,
      type: 'user',
    };

    searchAllUsingPOST(query)
      .then((response) => {
        if (response?.data?.dataList && response.data.dataList.length) {
          const newDataList = [...dataList, ...response.data.dataList];
          setTempList(newDataList);
          setCurrentPage(currentPage + 1);
          setHasMore(newDataList.length < response.data.dataList.length);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        // 处理请求错误
        console.error(error);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [values]);

  useEffect(() => {
    setTempList([]);
    setDataList([]);
    forceUpdate();
  }, []);

  useEffect(() => {
    setDataList(tempList);
    console.log('tempList');
    console.log(tempList);
  }, [tempList]);

  return (
    <InfiniteScroll
      key="infiniteScrollParent"
      dataLength={dataList.length}
      next={fetchData}
      hasMore={dataList.length < 1000}
      loader={<Divider plain>It is all, nothing more 🤐</Divider>}
      endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      scrollableTarget="scrollableDiv"
    >
      <List
        grid={{ gutter: 10, column: 3 }}
        dataSource={dataList}
        renderItem={(item) => (
          <List.Item>
            <p></p>
            <Card>
              <Meta
                avatar={
                  <Avatar
                    size={'large'}
                    src={item.userAvatar}
                    onClick={() => {
                      // setCurrentUser(userVo);
                      // setUserModalVisible(true);
                    }}
                  />
                }
                title={item.userName}
                description={
                  <div
                    style={{
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {item.userProfile}
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};
export default UserSearchModal;
