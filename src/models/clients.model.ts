import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Addresses } from './addresses.model';

@Table({
  tableName: 'Clients',
  timestamps: true,
})
export class Clients extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    comment: 'Уникальный идентификатор клиента',
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'имя',
  })
  first_name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'фамилия',
  })
  last_name: string;

  @HasMany(() => Addresses)
  addresses: Addresses[];

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'отчество',
  })
  patronymic: string;

  @Column({
    type: DataType.STRING(64),
    unique: {
      name: 'UniquePhoneNumber',
      msg: 'Такой номер телефона уже используется',
    },
    comment: 'Мобильный номер телефона',
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Дополнительная информация о клиенте',
  })
  about_client: string;

  @CreatedAt
  create_dt: Date;

  @UpdatedAt
  update_dt: Date;
}
