import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormText,
} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {FormattedMessage, history, SelectLang, useIntl, Helmet} from '@umijs/max';
import {Alert, Button, Divider, Image, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useState} from 'react';
import {userRegisterUsingPOST} from "@/services/pointsearch_backend/userController";

const loginPath = '/user/login';
const Lang = () => {
  const langClassName = useEmotionCss(({token}) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang/>}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {status, type: loginType} = userLoginState;
  const intl = useIntl();

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 登录
      const res = await userRegisterUsingPOST({...values});
      if (res.data) {
        // console.log(res.data)
        message.success('注册成功！');
        setTimeout(() => {
          history.push(loginPath);
        }, 100);
        return;
      } else {
        message.error('注册失败，请重试！');
      }
    } catch (error) {
      console.log(error);
      message.error('注册失败，请重试！');
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '注册页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang/>
      <LoginFormPage
        submitter={{
          searchConfig: {
            submitText: intl.formatMessage({id: '注册'}),
          },
        }}
        logo={<img alt="logo" src="/logo.svg"/>}
        title="PointSearch"
        subTitle={intl.formatMessage({id: 'PointSearch搜索平台'})}
        initialValues={{
          autoLogin: true,
        }}
        activityConfig={{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            borderRadius: 8,
            backgroundColor: '#1677FF',
          },
          title: '猿二哈的blog',
          subTitle: '猿二哈的blog',
          action: (
            <div>
              <Image src={'/adminAvatar.png'} style={{width: 120}}></Image>
              <Divider type={"vertical"}></Divider>
              <Button
                size="large"
                style={{
                  borderRadius: 20,
                  background: '#fff',
                  color: '#1677FF',
                  width: 120,
                }}
                href={'https://blog.csdn.net/m0_62288512?type=blog'}>
                去看看
              </Button>
            </div>
          ),
        }}
        onFinish={async (values) => {
          await handleSubmit(values as API.UserRegisterRequest);
        }}>
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
          items={[
            {
              key: 'account',
              label: intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '用户注册',
              }),
            },
          ]}
        />
        {status === 'error' && loginType === 'account' && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误(admin/ant.design)',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="checkPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '确认密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入确认密码！"
                    />
                  ),
                },
              ]}
            />
          </>
        )}
      </LoginFormPage>

      <Footer/>
    </div>
  )
    ;
};

export default Login;
