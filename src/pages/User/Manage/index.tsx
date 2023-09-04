import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Avatar, Button, message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import {
  addUserUsingPOST, deleteUsersUsingPOST,
  deleteUserUsingPOST,
  listUserByPageUsingPOST,
  updateUserUsingPOST
} from "@/services/pointsearch_backend/userController";
import UpdateModal from "@/pages/User/Manage/components/UpdateModal";
import CreateModal from "@/pages/User/Manage/components/CreateModal";


const TableList: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [showDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.User) => {
    const hide = message.loading('正在添加...');
    try {
      await addUserUsingPOST({...fields} as API.UserAddRequest);
      hide();
      message.success('添加成功!');
      setCreateModalVisible(false)
      actionRef.current?.reload()
      return true;
    } catch (error: any) {
      hide();
      message.error('添加失败！' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.User) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateUserUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload()
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (record: API.User) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteUserUsingPOST({id: record.id});
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };
  /**
   *  Delete node
   * @zh-CN 批量删除节点
   *
   * @param selectedRows
   */
  const handleRemoveBatchByIds = async (record: API.User[]) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      const newPeople: { id: number | undefined }[] = record.map((temp) => ({id: temp.id}));
      await deleteUsersUsingPOST(newPeople);
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const columns: ProColumns<API.User>[] = [
    {
      title: 'ID',
      align: "center",
      fixed: 'right',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '账号',
      align: "center",
      fixed: 'right',
      dataIndex: 'userAccount',
      valueType: 'text',
    },
    {
      title: '用户昵称',
      align: "center",
      fixed: 'right',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户角色',
      align: "center",
      fixed: 'right',
      dataIndex: 'userRole',
      valueEnum: {
        user: {
          text: '用户',
          // status: 'Processing',
        },
        admin: {
          text: '管理员',
          // status: 'Default',
        },
      },
    },
    {
      title: '微信开放平台id',
      align: "center",
      fixed: 'right',
      dataIndex: 'unionId',
      valueType: 'text',
    },
    {
      title: '公众号openId',
      align: "center",
      fixed: 'right',
      dataIndex: 'mpOpenId',
      valueType: 'text',
    },
    {
      title: '用户头像',
      align: "center",
      fixed: 'right',
      dataIndex: 'userAvatar',
      render: (_, record) => (
        <img src={record.userAvatar} alt="Item Image" style={{ width: '100px', height: 'auto' }} />
      ),
    },
    {
      title: '用户简介',
      align: "center",
      fixed: 'right',
      dataIndex: 'userProfile',
      valueType: 'textarea',
    },
    {
      title: '操作',
      align: "center",
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button key="config" type="link" onClick={() => {
          setUpdateModalVisible(true);
          setCurrentRow(record);
        }}>修改</Button>,
        <Popconfirm
          key="config"
          title="确认要删除吗？"
          onConfirm={
            async () => {
              handleRemove(record);
            }
          }
          okText="确认"
          cancelText="取消">
          <Button danger type="text">删除</Button>
        </Popconfirm>,

      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.User, API.PageParams>
        headerTitle={'用户列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{labelWidth: 120,}}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}>
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="添加用户"/>
          </Button>,
        ]}
        request={async (params) => {
          const res: any = await listUserByPageUsingPOST({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div> 已选择{' '}
              <a style={{fontWeight: 600,}}>
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }>
          <Popconfirm
            title="确认要删除吗？"
            onConfirm={
              async () => {
                await handleRemoveBatchByIds(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }
            }
            okText="确认"
            cancelText="取消">
            <Button> 批量删除 </Button>
          </Popconfirm>
          {/*<Button type="primary">批量审批</Button>*/}
        </FooterToolbar>
      )}

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />
      <CreateModal
        columns={columns}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
        onSubmit={async (values) => {
          handleAdd(values);

        }}
        visible={createModalVisible}
      />
    </PageContainer>
  );
};

export default TableList;
