import React, { useEffect, useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { PropertyModel } from '@/ts/base/model';
import { XProperty } from '@/ts/base/schema';
import { getUuid } from '@/utils/tools';
import thing from '@/ts/controller/thing';

interface Iprops {
  title: string;
  open: boolean;
  data: XProperty | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}
/*
  特性编辑模态框
*/
const PropertyModal = (props: Iprops) => {
  const [selectType, setSelectType] = useState<string>();
  const { open, title, handleOk, data, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [formKey, setFormKey] = useState<string>();
  useEffect(() => {
    setFormKey(getUuid());
  }, [open]);
  const getFromColumns = () => {
    const columns: ProFormColumnsType<PropertyModel>[] = [
      {
        title: '属性名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true, message: '特性名称为必填项' }],
        },
      },
      {
        title: '属性代码',
        dataIndex: 'code',
        readonly: true,
      },
      {
        title: '属性类型',
        dataIndex: 'valueType',
        valueType: 'select',
        fieldProps: {
          options: [
            {
              value: '数值型',
              label: '数值型',
            },
            {
              value: '描述型',
              label: '描述型',
            },
            {
              value: '选择型',
              label: '选择型',
            },
            {
              value: '分类型',
              label: '分类型',
            },
            {
              value: '附件型',
              label: '附件型',
            },
            {
              value: '日期型',
              label: '日期型',
            },
            {
              value: '时间型',
              label: '时间型',
            },
            {
              value: '用户型',
              label: '用户型',
            },
          ],
          onSelect: (select: string) => {
            setSelectType(select);
          },
        },
        formItemProps: {
          rules: [{ required: true, message: '特性类型为必填项' }],
        },
      },
    ];
    if (selectType === '选择型') {
      columns.push({
        title: '选择枚举分类',
        dataIndex: 'dictId',
        valueType: 'select',
        formItemProps: { rules: [{ required: true, message: '枚举分类为必填项' }] },
        request: async () => {
          // const res = await thing.loadDicts();
          // return res.map((item) => {
          //   return { id: item.id, label: item.name, value: item.id };
          // });
          return [];
        },
        fieldProps: {
          disabled: selectType !== '选择型',
          showSearch: true,
        },
      });
    }

    if (selectType === '数值型') {
      columns.push({
        title: '单位',
        dataIndex: 'unit',
      });
    }
    columns.push({
      title: '属性定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '属性定义为必填项' }],
      },
    });
    return columns;
  };
  return (
    <SchemaForm<PropertyModel>
      key={formKey}
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (title.includes('修改')) {
            setSelectType(data?.valueType);
            formRef.current?.setFieldsValue(data);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        values = { ...data, ...values };
        if (thing.property) {
          if (title.includes('新增')) {
            handleOk((await thing.property.createProperty(values)) !== undefined);
          } else {
            handleOk((await thing.property.updateProperty(values)) !== undefined);
          }
        }
      }}
      columns={getFromColumns()}></SchemaForm>
  );
};

export default PropertyModal;
