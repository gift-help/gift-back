import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class SuggestDto {
  @ApiProperty({
    type: [String],
    description: 'Keywords to build prompt',
    example: ['мужской', '60 лет', 'Повод: Юбилей', 'Интересы: интерьер, бокс, кино, автомобили, honda accord, тренажерный зал, сериалы, путешествия, современная брендовая одежда', 'имеет ухоженную домашнюю территорию: кирпичный мангал, беседка, баня, бассейн, огород, гараж'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];
}

