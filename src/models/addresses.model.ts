import { literal } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Clients } from './clients.model';

@Table({
  tableName: 'Addresses',
  timestamps: true,
})
export class Addresses extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: literal('uuid_generate_v4()'),
    allowNull: false,
    comment: 'Уникальный идентификатор адреса',
  })
  uid: string;

  @ForeignKey(() => Clients)
  @Column({
    allowNull: false,
    comment: 'Уникальный идентификатор клиента',
  })
  client_id: number;

  @BelongsTo(() => Clients)
  clients: Clients;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    comment: 'Город',
  })
  city: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Адрес клиента',
  })
  address: string;

  @Column({
    type: DataType.STRING(512),
    allowNull: true,
    comment: 'Дополнительное описание к адресу',
  })
  description: string;

  @CreatedAt
  create_dt: Date;

  @UpdatedAt
  update_dt: Date;
}
