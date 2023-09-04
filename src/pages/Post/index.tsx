import React, {useState, useEffect, useRef, useReducer, ChangeEvent} from 'react';
import {Avatar, Button, Card, Divider, FloatButton, Layout, List, message, Skeleton, Space, Spin, Tag} from 'antd';
import {listPostVOByPageUsingPOST} from "@/services/pointsearch_backend/postController";
import InfiniteScroll from "react-infinite-scroll-component";
import Sider from "antd/es/layout/Sider";
import {Header} from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import {Provider} from 'react-redux';
import {
  LikeOutlined,
  LikeTwoTone,
  MessageOutlined, PlusCircleOutlined, PlusCircleTwoTone, PlusOutlined,
  StarOutlined,
  StarTwoTone
} from "@ant-design/icons";
import PostDetailModal from "@/pages/Post/components/PostDetailModal";
import UserDetailModal from "@/pages/Post/components/UserDetailModal";
import PublishModal from "@/pages/Post/components/PublishModal";
import {doPostFavourUsingPOST} from "@/services/pointsearch_backend/postFavourController";
import {doPostThumbUsingPOST} from "@/services/pointsearch_backend/postThumbController";
import NotificationModal from "@/pages/Post/components/NotificationModal";
import {listPostCommentVOByPageUsingPOST} from "@/services/pointsearch_backend/postCommentController";


// header的样式
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 40,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#ECECEEFF',
};

// sider的样式
const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#ECECEEFF',
};
const Index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataList, setDataList] = useState<API.PostVO[]>([]);
  const [tempList, setTempList] = useState<API.PostVO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.PostVO>();
  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  const [publishModalVisible, setPublishModalVisible] = useState<boolean>(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [searchContext, setSearchContext] = useState('');

  /**
   * 滚动翻页时的方法
   */
  const fetchData = () => {
    setLoading(true);

    const query: API.PostQueryRequest = {
      current: currentPage,
      pageSize: pageSize,
    };

    listPostVOByPageUsingPOST(query)
      .then(response => {
        if (response?.data?.records && response.data.total) {
          const newDataList = [...dataList, ...response.data.records];
          setTempList(newDataList);
          setCurrentPage(currentPage + 1);
          setHasMore(newDataList.length < response.data.total);
        } else {
          setHasMore(false);
        }
      })
      .catch(error => {
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
  }, []);

  useEffect(() => {
    setDataList(tempList)
    console.log("dataList")
    console.log(dataList)
  }, [tempList]);

  /**
   * 修改收藏
   */
  const handlePostFavour = async (item: API.PostVO) => {
    try {
      const postId = item.id
      await doPostFavourUsingPOST({postId} as API.PostFavourAddRequest);
      // 发送成功
      item.hasFavour = !item.hasFavour
      if (item.hasFavour) {
        item.favourNum = item.favourNum + 1;
      } else {
        item.favourNum = item.favourNum - 1;
      }
      forceUpdate();
    } catch (e) {
      console.log(e)
      console.log("修改失败")
    }
  }
  /**
   * 修改喜欢
   */
  const handlePostThumb = async (item: API.PostVO) => {
    try {
      const postId = item.id
      await doPostThumbUsingPOST({postId} as API.PostThumbAddRequest);
      // 发送成功
      item.hasThumb = !item.hasThumb

      if (item.hasThumb) {
        item.thumbNum = item.thumbNum + 1;
      } else {
        item.thumbNum = item.thumbNum - 1;
      }

      forceUpdate();
    } catch (e) {
      console.log(e)
      console.log("修改失败")
    }
  }

  return (
    <div>
      <InfiniteScroll
        key="infiniteScrollParent"
        dataLength={dataList.length}
        next={fetchData}
        hasMore={dataList.length < 1000}
        loader={<Divider plain>It is all, nothing more 🤐</Divider>}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv">
        <Layout>
          <Header style={headerStyle}>
          </Header>
          <Layout>
            <Sider style={siderStyle} width={'5%'}></Sider>
            <Sider style={siderStyle} width={'60%'}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={dataList}
                renderItem={(item) => (
                  <div>
                    <Card>
                      <List.Item
                        key={item.title}
                        style={{textAlign: "left"}}
                        actions={[
                          // 时间
                          <Space key="list-vertical-star-o">{item?.createTime?.substring(0, 10)}</Space>,
                          // 点赞
                          <Button type={"text"} block key="list-vertical-star-o" onClick={() => {
                            handlePostThumb(item)
                          }}>{item.hasThumb ? <LikeTwoTone/> : <LikeOutlined/>}{item.thumbNum}</Button>,
                          // 收藏
                          <Button type={"text"} block key="list-vertical-star-o" onClick={() => {
                            handlePostFavour(item)
                          }}>{item.hasFavour ? <StarTwoTone/> : <StarOutlined/>}{item.favourNum}</Button>,
                          // 评论
                          <Button type={"text"} block key="list-vertical-star-o" onClick={() => {
                            setPostModalVisible(true);
                            setCurrentRow(item);
                          }}><MessageOutlined/>{item.commentNum}</Button>,
                        ]}>
                        <List.Item.Meta
                          style={{textAlign: "left"}}
                          avatar={
                            <Avatar src={item?.user?.userAvatar} onClick={() => {
                              setUserModalVisible(true);
                              setCurrentRow(item);
                            }}/>
                          }
                          title={
                            <a onClick={() => {
                              setUserModalVisible(true);
                              setCurrentRow(item);
                            }}>{item?.user?.userName}
                            </a>}
                        />
                        <h2 onClick={() => {
                          setPostModalVisible(true);
                          setCurrentRow(item);
                        }}>{item.title}</h2>
                        <p style={{
                          textAlign: "left",
                          lineHeight: '1.5',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2
                        }} onClick={() => {
                          setPostModalVisible(true);
                          setCurrentRow(item);
                        }}>{item.content}
                        </p>
                      </List.Item>
                    </Card>
                    <p></p>
                  </div>
                )}
              />
              <p></p>
            </Sider>
            <Sider style={siderStyle} width={'2%'}></Sider>
            <Sider style={siderStyle} width={'25%'}>
              <NotificationModal> </NotificationModal>
            </Sider>
            <Sider style={siderStyle} width={'8%'}></Sider>
          </Layout>
        </Layout>


        <UserDetailModal
          onCancel={() => {
            setUserModalVisible(false);
            setCurrentRow(undefined);
          }}
          visible={userModalVisible}
          values={currentRow?.user || {}}
        />
        <PublishModal
          onCancel={() => {
            setPublishModalVisible(false);
          }}
          visible={publishModalVisible}
          setVisible={async () => {
            setPublishModalVisible(false);
            window.location.reload()
          }}
        />

        {/*悬浮窗口*/}
        <FloatButton
          tooltip={"发布帖子"}
          onClick={() => {
            setPublishModalVisible(true);
          }}
          style={{
            width: '60px',
            height: '60px',
            fontSize: '24px',
          }} shape="circle"
          type="primary"
          icon={<PlusOutlined/>}/>
      </InfiniteScroll>
      {postModalVisible && (<PostDetailModal
        onCancel={() => {
          setPostModalVisible(false);
          setCurrentRow(undefined);
        }}
        visible={postModalVisible}
        values={currentRow || {}}
      />)}
    </div>
  );
};

export default Index;
