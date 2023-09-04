import '@umijs/max';
import { Avatar, Button, Card, Image, List, Space } from 'antd';

import PostDetailModal from '@/pages/Post/components/PostDetailModal';
import UserDetailModal from '@/pages/Post/components/UserDetailModal';
import { doPostFavourUsingPOST } from '@/services/pointsearch_backend/postFavourController';
import { doPostThumbUsingPOST } from '@/services/pointsearch_backend/postThumbController';
import { searchAllUsingPOST } from '@/services/pointsearch_backend/searchController';
import {
  LikeOutlined,
  LikeTwoTone,
  MessageOutlined,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import React, { useEffect, useReducer, useState } from 'react';

export type Props = {
  values: string;
};

const AllSearchModal: React.FC<Props> = (props) => {
  const { values } = props;
  const [dataList, setDataList] = useState<API.SearchVO>();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tempList, setTempList] = useState<API.SearchVO>();
  const [hasMore, setHasMore] = useState(true);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.PostVO>();
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  /**
   * 滚动翻页时的方法
   */
  const fetchData = () => {
    setLoading(true);

    const query: API.SearchRequest = {
      current: currentPage,
      pageSize: pageSize,
      searchText: values,
      type: 'all',
    };

    searchAllUsingPOST(query)
      .then((response) => {
        if (response?.data) {
          console.log('response?.data');
          console.log(response?.data);
          setTempList(response?.data);
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
    // setTempList(undefined);
    // setDataList(undefined);
    forceUpdate();
  }, []);

  useEffect(() => {
    setDataList(tempList);
    console.log('tempList');
    console.log(tempList);
  }, [tempList]);
  /**
   * 修改收藏
   */
  const handlePostFavour = async (item: API.PostVO) => {
    try {
      const postId = item.id;
      await doPostFavourUsingPOST({ postId } as API.PostFavourAddRequest);
      // 发送成功
      item.hasFavour = !item.hasFavour;
      if (item.hasFavour) {
        item.favourNum = item.favourNum + 1;
      } else {
        item.favourNum = item.favourNum - 1;
      }
      forceUpdate();
    } catch (e) {
      console.log(e);
      console.log('修改失败');
    }
  };
  /**
   * 修改喜欢
   */
  const handlePostThumb = async (item: API.PostVO) => {
    try {
      const postId = item.id;
      await doPostThumbUsingPOST({ postId } as API.PostThumbAddRequest);
      // 发送成功
      item.hasThumb = !item.hasThumb;

      if (item.hasThumb) {
        item.thumbNum = item.thumbNum + 1;
      } else {
        item.thumbNum = item.thumbNum - 1;
      }

      forceUpdate();
    } catch (e) {
      console.log(e);
      console.log('修改失败');
    }
  };
  return (
    <div>
      <Card title={'文章'}>
        <List
          grid={{ gutter: [16, 10], column: 2 }}
          dataSource={dataList?.postList}
          renderItem={(item) => (
            <Card
              key={item.title}
              style={{ textAlign: 'left', width: '95%' }}
              actions={[
                // 时间
                <Space key="list-vertical-star-o">{item?.createTime?.substring(0, 10)}</Space>,
                // 点赞
                <Button
                  type={'text'}
                  block
                  key="list-vertical-star-o"
                  onClick={() => {
                    handlePostThumb(item);
                  }}
                >
                  {item.hasThumb ? <LikeTwoTone /> : <LikeOutlined />}
                  {item.thumbNum}
                </Button>,
                // 收藏
                <Button
                  type={'text'}
                  block
                  key="list-vertical-star-o"
                  onClick={() => {
                    handlePostFavour(item);
                  }}
                >
                  {item.hasFavour ? <StarTwoTone /> : <StarOutlined />}
                  {item.favourNum}
                </Button>,
                // 评论
                <Button
                  type={'text'}
                  block
                  key="list-vertical-star-o"
                  onClick={() => {
                    setPostModalVisible(true);
                    setCurrentRow(item);
                  }}
                >
                  <MessageOutlined />
                  {item.commentNum}
                </Button>,
              ]}
            >
              <Meta
                style={{ textAlign: 'left' }}
                avatar={
                  <Avatar
                    src={item?.user?.userAvatar}
                    onClick={() => {
                      setUserModalVisible(true);
                      setCurrentRow(item);
                    }}
                  />
                }
                title={
                  <Space
                    onClick={() => {
                      setUserModalVisible(true);
                      setCurrentRow(item);
                    }}
                  >
                    {item?.user?.userName}
                  </Space>
                }
              />
              <p></p>
              <h3
                onClick={() => {
                  setPostModalVisible(true);
                  setCurrentRow(item);
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  textAlign: 'left',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                }}
                onClick={() => {
                  setPostModalVisible(true);
                  setCurrentRow(item);
                }}
              >
                {item.content}
              </p>
            </Card>
          )}
        />
      </Card>
      <p></p>
      <Card title={'用户'}>
        <List
          grid={{ gutter: 10, column: 3 }}
          dataSource={dataList?.userList}
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
      </Card>
      <p></p>
      <Card title={'图片'}>
        <List
          grid={{ column: 4 }}
          dataSource={dataList?.pictureList}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{ height: 300, width: 300 }}
                cover={
                  <Image alt={'图片加载失败'} style={{ height: 240, width: 300 }} src={item.url} />
                }
              >
                <Meta title={item.title} />
              </Card>
            </List.Item>
          )}
        />
      </Card>
      {postModalVisible && (
        <PostDetailModal
          onCancel={() => {
            setPostModalVisible(false);
            setCurrentRow(undefined);
          }}
          visible={postModalVisible}
          values={currentRow || {}}
        />
      )}
      {userModalVisible && (
        <UserDetailModal
          onCancel={() => {
            setUserModalVisible(false);
            setCurrentRow(undefined);
          }}
          visible={userModalVisible}
          values={currentRow?.user || {}}
        />
      )}
    </div>
  );
};
export default AllSearchModal;
