import type {ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Avatar, Button, Card, Descriptions, Input, List, Modal, Space, Upload} from 'antd';
import React, {useEffect, useRef} from 'react';
import Meta from "antd/es/card/Meta";
import {LikeOutlined, LikeTwoTone, MessageOutlined, StarOutlined, StarTwoTone} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export type Props = {
  values: API.User;
  onCancel: () => void;
  visible: boolean;
};

const PostDetailModal: React.FC<Props> = (props) => {
  const {values, visible, onCancel} = props;

  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
    console.log("values")
    console.log(values)
  }, [values])

  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <p style={{height: 20}}></p>
      <Descriptions column={1}>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>昵称:</Space>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>{values.userName}</Space>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>头像:</Space>
          <Avatar shape="square" size={64} src={values.userAvatar}/>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>身份:</Space>
          <Space style={{
            fontSize: '19px',
          }}>{values.userRole === 'user' ? '用户' : values.userRole === 'admin' ? '管理员' : '未知'}</Space>
        </Descriptions.Item>
        <p></p>
        <Descriptions.Item>
          <Space style={{
            fontSize: '19px',
            width: '100px'
          }}>简介:</Space>
          <Space style={{
            fontSize: '19px',
            width: '350px'
          }}>{values.userProfile}</Space>
        </Descriptions.Item>

      </Descriptions>
    </Modal>
  );
};
export default PostDetailModal;
