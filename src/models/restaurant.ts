import { Model, Table, Column, DataType, Default } from 'sequelize-typescript';

@Table({ tableName: 'restaurant' })
class Restaurant extends Model<Restaurant> {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    restaurant_id!: string;

    @Column(DataType.STRING)
    restaurant_name!: string;

    @Column(DataType.STRING)
    address!: string;

    @Column(DataType.BOOLEAN)
    veg_only!: boolean;

    @Column(DataType.INTEGER)
    cost!: number;

    @Column(DataType.ARRAY(DataType.STRING))
    cuisine_types!: string[];

    @Default(new Date())
    @Column(DataType.DATE)
    createdAt!: Date;

    @Default(new Date())
    @Column(DataType.DATE)
    updatedAt!: Date;

    @Column(DataType.BOOLEAN)
    isOpen!: boolean;
}

export default Restaurant;
