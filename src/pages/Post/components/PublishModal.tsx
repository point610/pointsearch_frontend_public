import type {ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Avatar, Button, Descriptions, Input, message, Modal, Popconfirm, Space, Switch} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import NewTag from "@/pages/Post/components/NewTag";
import TextArea from "antd/es/input/TextArea";
import {any} from "prop-types";
import {addPostUsingPOST} from "@/services/pointsearch_backend/postController";

export type Props = {
  onCancel: () => void;
  visible: boolean;
  setVisible: (values: boolean) => Promise<void>;

};

const CreateModal: React.FC<Props> = (props) => {
  const {visible, onCancel, setVisible} = props;
  // const [postAddRequest, setPostAddRequest] = useState<API.PostAddRequest>();
  const [tags, setPostTags] = useState<string []>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  /**
   * 发布帖子
   */
  const handlePublishPost = async () => {
    const hide = message.loading('正在添加...');
    try {
      // console.log("title " + title)
      // console.log("content " + content)
      // console.log("postTags " + tags)
      // console.log("postTags " + typeof tags)
      await addPostUsingPOST({title, content, tags} as API.PostAddRequest);
      hide();
      message.success('添加成功!');
      setVisible(false)
      return true;
    } catch (error: any) {
      hide();
      message.error('添加失败！' + error.message);
      return false;
    }
  };

  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <p style={{height: 20}}></p>
      <Descriptions column={1}>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>标题</Space>
          <Input onChange={handleTitleChange}></Input>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>内容</Space>
          <TextArea onChange={handleContentChange}> </TextArea>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>标签</Space>
          <NewTag
            tags={tags}
            setTags={async (values) => {
              setPostTags(values);
            }}
          ></NewTag>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Button type="primary" onClick={handlePublishPost}>{"发布帖子"}</Button>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default CreateModal;
