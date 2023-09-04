import '@umijs/max';
import {Avatar, Button, Card, Col, Divider, Layout, List, message, Modal, Popover, Row, Skeleton, Space} from 'antd';
import React, {ChangeEvent, useEffect, useReducer, useRef, useState} from 'react';
import Meta from "antd/es/card/Meta";
import {DownOutlined, LikeOutlined, LikeTwoTone, MessageOutlined, StarOutlined, StarTwoTone} from "@ant-design/icons";
import {
  addPostCommentUsingPOST,
  listPostCommentVOByPageUsingPOST
} from "@/services/pointsearch_backend/postCommentController";
import TextArea from "antd/es/input/TextArea";
import {useModel} from "@@/exports";
import UserDetailModal from "@/pages/Post/components/UserDetailModal";

export type Props = {
  values: API.PostVO;
  onCancel: () => void;
  visible: boolean;
};

const PostDetailModal: React.FC<Props> = (props) => {
  const {values, visible, onCancel} = props;
  const [postCommentVO, setPostCommentVO] = useState<API.PostCommentVO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fatherCommentContext, setFatherCommentContext] = useState('');
  const [sonCommentContext, setSonCommentContext] = useState('');
  const {initialState, setInitialState} = useModel('@@initialState');
  const [userVo] = useState<API.UserVO>({...initialState?.loginUser})
  const [tempPostCommentVOList, setTempPostCommentVOList] = useState<API.PostCommentVO[]>([]);
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<API.User>();
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  /**
   * 初始化评论的方法
   */
  const fetchCommentData = async () => {
    if (!hasMore) {
      return
    }
    const query: API.PostCommentQueryRequest = {
      postId: values.id,
      current: currentPage,
      pageSize: pageSize,
    };
    await listPostCommentVOByPageUsingPOST(query).then(response => {
      // console.log('response')
      // console.log(response?.data?.records.length)
      // console.log('currentPage')
      // console.log(currentPage)

      if (response?.data?.records && response.data.total) {
        const newDataList = [...postCommentVO, ...response.data.records];
        setTempPostCommentVOList(newDataList);
        setCurrentPage(currentPage + 1);
        setHasMore(newDataList.length < response.data.total);
        if (response?.data?.records.length === 0) {
          setHasMore(false)
        }
      } else {
        setHasMore(false);
      }

    }).catch(error => {
      // 处理请求错误
      console.error(error);
      setHasMore(false);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    setPostCommentVO(tempPostCommentVOList)
  }, [tempPostCommentVOList]);

  // 初始化页面时发送请求
  useEffect(() => {
    // 在组件挂载后触发的事件逻辑
    console.log('组件已打开');
    // 执行其他操作或触发其他事件
    fetchCommentData();
    return () => {
      // 在组件卸载时执行的清理操作
      console.log('组件已关闭');
      // 执行其他清理操作
      setPostCommentVO([])
    };
  }, [values]);


  /**
   * 输入评论内容-father
   */
  const handleFatherCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFatherCommentContext(event.target.value);
  };
  /**
   * 输入评论内容-son
   */
  const handleSonCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSonCommentContext(event.target.value);
  };
  /**
   * 发表评论-父评论
   */
  const handleFatherComment = () => {
    const query: API.PostCommentAddRequest = {
      postId: values.id,
      content: fatherCommentContext,
      // fatherId:
    };

    addPostCommentUsingPOST(query).then(() => {
      message.success('发表评论成功')
      setFatherCommentContext('')
      // TODO 重新请求评论数据
      forceUpdate()
    }).catch((e) => {
      console.log(e)
      message.error('发表评论失败')
    })

  };
  /**
   * 发表评论-子评论
   */
  const handleSonComment = (id: any, prefix: string) => {
    const query: API.PostCommentAddRequest = {
      postId: values.id,
      content: prefix + ': ' + sonCommentContext,
      fatherId: id
    };
    addPostCommentUsingPOST(query).then(() => {
      message.success('发表评论成功')
      setSonCommentContext('')
      // TODO 重新请求评论数据
    }).catch((e) => {
      console.log(e)
      message.error('发表评论失败')
    })
  };

  return (

    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <p style={{height: 20}}></p>
      <Card style={{textAlign: "left"}} actions={[
        <Space key="list-vertical-star-o">{values?.createTime?.substring(0, 10)}</Space>,
        <Space key="list-vertical-star-o">
          {values.hasThumb ? <StarTwoTone/> : <StarOutlined/>}{values.favourNum}</Space>,
        <Space key="list-vertical-star-o">
          {values.hasThumb ? <LikeTwoTone/> : <LikeOutlined/>}{values.thumbNum}</Space>,
        <Space key="list-vertical-star-o"><MessageOutlined/>{values.commentNum}</Space>,
      ]}>
        <Meta
          style={{textAlign: "left"}}
          avatar={
            <Avatar src={values?.user?.userAvatar} onClick={() => {
              setCurrentUser(values.user)
              setUserModalVisible(true)
            }}/>
          }
          title={
            <Space onClick={() => {
              setCurrentUser(values.user)
              setUserModalVisible(true)
            }}>
              {values.title}
            </Space>
          }/>
        <p></p>
        <Space style={{
          fontSize: '18px',
          textAlign: "left",
        }}>{values.content}
        </Space>
      </Card>
      <p></p>
      {/*自己发布评论*/}
      <Card>
        <Skeleton loading={false} avatar paragraph={{rows: 4}}>
          <Meta
            avatar={<Avatar src={userVo.userAvatar} onClick={() => {
              setCurrentUser(userVo)
              setUserModalVisible(true)
            }}/>}
            description={
              // 发表评论-father
              <div>
                <TextArea
                  showCount
                  maxLength={100}
                  style={{height: 120, resize: 'none'}}
                  onChange={handleFatherCommentChange}
                  placeholder="欢迎输入友善的评论~"
                />
                <p></p>
                <Button type={"primary"} onClick={handleFatherComment}>发表评论</Button>
              </div>
            }/>
        </Skeleton>
      </Card>
      {/*自己发布评论*/}  <p></p>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={postCommentVO}
        renderItem={(item) => (
          <div>
            <Card
              style={{textAlign: "left", background: '#E8E8E8FF'}}
              actions={[
                // 时间
                <Space key="list-vertical-star-o">{item?.createTime?.substring(0, 10)}</Space>,
                // 回复-son
                <Popover
                  key="list-vertical-star-o"
                  placement="rightBottom"
                  title={"回复@" + item?.user?.userName}
                  content={
                    <div>
                      <TextArea
                        showCount
                        maxLength={100}
                        style={{height: 120, resize: 'none'}}
                        onChange={handleSonCommentChange}
                        placeholder="欢迎输入友善的评论~"
                      />
                      <p></p>
                      <Button
                        type={"primary"}
                        onClick={() => handleSonComment(item.id, "回复@" + item?.user?.userName)}>发表评论</Button>
                    </div>}
                  trigger="click">
                  <Space key="list-vertical-star-o">{'回复'}</Space>
                </Popover>,
              ]}>
              <Meta
                style={{textAlign: "left"}}
                avatar={
                  <Avatar src={item?.user?.userAvatar} onClick={() => {
                    setCurrentUser(item.user)
                    setUserModalVisible(true)
                  }}/>
                }
                title={
                  <Space>
                    {item?.user?.userName}
                  </Space>
                }/>
              <p></p>
              {/*评论的内容*/}
              <Space style={{
                fontSize: '16px',
                textAlign: "left",
              }}>{item.content}
              </Space>
            </Card>
            <div>
              {(item.son && item.son.length > 0) &&
                <div>
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={item.son}
                    renderItem={(son) => (
                      <div>
                        <Row>
                          <Col span={3} style={{background: '#fff'}}></Col>
                          <Col span={21} style={{background: '#fff'}}>
                            {/*子评论的card*/}
                            <Card size={"small"}
                                  style={{textAlign: "left", background: '#E8E8E8FF'}}
                                  actions={[
                                    // 时间
                                    <Space key="list-vertical-star-o">{son?.createTime?.substring(0, 10)}</Space>,
                                    // 回复-son
                                    <Popover
                                      key="list-vertical-star-o"
                                      placement="rightBottom"
                                      title={"@" + son?.user?.userName}
                                      content={
                                        <div>
                                          <TextArea
                                            showCount
                                            maxLength={100}
                                            style={{height: 120, resize: 'none'}}
                                            onChange={handleSonCommentChange}
                                            placeholder="欢迎输入友善的评论~"
                                          />
                                          <p></p>
                                          <Button
                                            type={"primary"}
                                            onClick={() => handleSonComment(item.id, "@" + son?.user?.userName)}>发表评论</Button>
                                        </div>}
                                      trigger="click">
                                      <Space key="list-vertical-star-o">{'回复'}</Space>
                                    </Popover>,
                                  ]}>
                              <Meta
                                style={{textAlign: "left"}}
                                avatar={
                                  <Avatar src={son?.user?.userAvatar} onClick={() => {
                                    setCurrentUser(item.user)
                                    setUserModalVisible(true)
                                  }}/>
                                }
                                title={
                                  <Space>
                                    {son?.user?.userName}
                                  </Space>
                                }/>
                              <p></p>
                              {/*评论的内容*/}
                              <Space style={{
                                fontSize: '13px',
                                textAlign: "left",
                                opacity: 0.7,
                              }}>{son.content}
                              </Space>
                            </Card>
                            {/*子评论的card*/}
                          </Col>
                        </Row>
                      </div>
                    )}
                  />
                </div>
              }
            </div>

          </div>
        )}
      />
      {/*按钮，点击加载*/}
      <p></p>
      {postCommentVO.length !== 0 && <Row>
        <Col span={22} style={{background: '#fff'}}></Col>
        <Col span={2} style={{background: '#fff'}}>
          <Button type="primary" shape="circle" onClick={() => fetchCommentData()}>
            <DownOutlined/>
          </Button>
        </Col>
      </Row>}

      {userModalVisible && <UserDetailModal
        onCancel={() => {
          setUserModalVisible(false);
          setCurrentUser(undefined);
        }}
        visible={userModalVisible}
        values={currentUser || {}}
      />}
    </Modal>
  );
};
export default PostDetailModal;
