import { requestConfig } from '@/requestConfig';
import { updateMyUserUsingPOST } from '@/services/pointsearch_backend/userController';
import { useModel } from '@@/exports';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Input, message, theme, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { ChangeEvent, useState } from 'react';

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const SettingInfo: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [userVo] = useState<API.UserVO>({ ...initialState?.loginUser });
  const { token } = theme.useToken();
  const [nameValue, setNameValue] = useState(userVo?.userName);
  const [profileValue, setProfileValue] = useState(userVo?.userProfile);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userVo?.userAvatar);

  /**
   * 修改昵称的输入的方法handleInputChange
   * @param event
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
    // console.log(nameValue)
  };
  /**
   * 修改个人简介的输入的方法handleInputChange
   * @param event
   */
  const handleProfileChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setProfileValue(event.target.value);
    // console.log(nameValue)
  };

  const clickButton = async () => {
    setButtonDisabled(true);
    userVo.userProfile = profileValue;
    userVo.userAvatar = imageUrl;
    userVo.userName = nameValue;
    const res = await updateMyUserUsingPOST({ ...userVo });
    if (res.data === true) {
      message.success('修改成功');
      setInitialState({
        loginUser: userVo,
      });
    } else {
      message.error('修改失败');
    }
    setButtonDisabled(false);
  };

  /**
   * 修改头像的输入的方法 handleChange
   * @param info
   */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setImageUrl(info.file.response.data);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card
      style={{
        borderRadius: 8,
      }}
      bodyStyle={{
        backgroundImage:
          initialState?.settings?.navTheme === 'realDark'
            ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
            : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
      }}
    >
      <div
        style={{
          backgroundPosition: '100% -30%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '274px auto',
          backgroundImage:
            "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
        }}
      >
        <div
          style={{
            fontSize: '23px',
            color: token.colorTextHeading,
          }}
        >
          个人设置
        </div>
        <Divider />
        <Descriptions column={1}>
          <Descriptions.Item>
            <span
              style={{
                fontSize: '19px',
                width: '100px',
              }}
            >
              昵称:
            </span>
            <Input size={'large'} allowClear value={nameValue} onChange={handleInputChange} />
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
            <span
              style={{
                fontSize: '19px',
                width: '100px',
              }}
            >
              头像:
            </span>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={requestConfig.baseURL + '/api/img/upload'}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
            <span
              style={{
                fontSize: '19px',
                width: '100px',
              }}
            >
              身份:
            </span>
            <span
              style={{
                fontSize: '17px',
                width: '100px',
              }}
            >
              {userVo.userRole === 'user'
                ? '用户'
                : userVo.userRole === 'admin'
                ? '管理员'
                : '未知'}
            </span>
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
            <span
              style={{
                fontSize: '19px',
                width: '100px',
              }}
            >
              简介:
            </span>
            <TextArea
              rows={3}
              placeholder="maxLength is 100"
              maxLength={100}
              value={profileValue}
              onChange={handleProfileChange}
            />
          </Descriptions.Item>
          <p></p>
          <Descriptions.Item>
            <Button disabled={buttonDisabled} type="primary" size={'large'} onClick={clickButton}>
              保存修改
            </Button>
          </Descriptions.Item>
        </Descriptions>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}
        ></div>
      </div>
    </Card>
  );
};
export default SettingInfo;
