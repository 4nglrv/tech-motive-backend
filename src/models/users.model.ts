import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Addresses } from './addresses.model';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class Users extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    unique: true,
    comment: 'yникальный идентификатор пользователя',
  })
  uid: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'e-mail',
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'пароль',
  })
  password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'питерские соли',
  })
  salt: string;

  @Column({
    type: DataType.ENUM({
      values: ['admin', 'manager', 'user'],
    }),
    allowNull: false,
    defaultValue: 'user',
    comment: 'роль пользователя',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'подтверждение аккаунта',
  })
  is_confirmed: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'id в телеге',
  })
  telegram: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'api ключ для телеграм бота',
  })
  api_key: string;

  @CreatedAt
  create_dt: Date;

  @UpdatedAt
  update_dt: Date;

  @HasOne(() => Addresses)
  addresses: Addresses;
}
