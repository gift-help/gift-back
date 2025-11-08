import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetRange, Gender, GiftFormat, Occasion, RelationLevel } from '@prisma/client';

class BaseDto {
  @ApiProperty({ enum: Gender, description: 'Пол человека' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Возраст человека', example: 25 })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ enum: Occasion, description: 'Повод для подарка' })
  @IsEnum(Occasion)
  occasion: Occasion;

  @ApiPropertyOptional({ description: 'Кастомный повод для подарка', example: 'Проводы в армию' })
  @IsOptional()
  @IsString()
  customOccasion?: string;

  @ApiProperty({ enum: GiftFormat, isArray: true, description: 'Формат ответа' })
  @IsEnum(GiftFormat, { each: true })
  formats: GiftFormat[];

  @ApiProperty({ enum: RelationLevel, description: 'Насколько хорошо знаешь человека' })
  @IsEnum(RelationLevel)
  relationLevel: RelationLevel;

  @ApiProperty({ enum: BudgetRange, description: 'Диапазон бюджета' })
  @IsEnum(BudgetRange)
  budgetRange: BudgetRange;

  @ApiPropertyOptional({ description: 'Кастомный диапазон бюджета', example: '300-800' })
  @IsOptional()
  @IsString()
  customBudget?: string;
}

export class GiftSessionDto {
  @ApiProperty({ description: 'Базовая информация', type: BaseDto })
  @ValidateNested()
  @Type(() => BaseDto)
  base: BaseDto;

  @ApiPropertyOptional({
    description: 'Произвольное описание',
    maxLength: 350,
    example: 'любит свой частный дом, ухоженную домашнюю территорию (кирпичный мангал, беседка, баня, бассейн), огород, гараж с инструментами, машину (honda accord 7), бокс смотреть и заниматься им, заниматься спортом (тренажерный зал), смотреть фильмы и сериалы, путешествовать, современную брендовую одежду\n' +
      'Ценовой диапазон до 2000 рублей',
  })
  @IsOptional()
  @IsString()
  @MaxLength(350)
  simpleDescription?: string;

  @ApiPropertyOptional({
    description: 'Теги интересов',
    example: { hobby: ['чтение книг', 'настольные игры'], sport: ['фитнес', 'йога'] },
  })
  @IsOptional()
  tags?: Record<string, string[]>;

  @ApiPropertyOptional({
    description: 'Ответы на вопросы',
    isArray: true,
    maxLength: 100,
    example: [
      'Больше всего любит сидеть дома и много работать, учиться',
      'Он предпочитает пассивный отдых дома, изредка может выбраться в ресторан',
    ],
  })
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  answers?: string[];
}
