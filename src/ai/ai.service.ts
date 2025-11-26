import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GiftSessionDto } from '../gift-session/dto/gift-session.dto';
import { Occasion } from '@prisma/client';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.YANDEX_API_KEY || '';

  getCyrillicOccasion = (occasion: Occasion): string => {
    const occasionMap: Record<Occasion, string> = {
      [Occasion.BIRTHDAY]: 'День рождения',
      [Occasion.NEW_YEAR]: 'Новый год',
      [Occasion.WEDDING]: 'Свадьба',
      [Occasion.ANNIVERSARY]: 'Годовщина',
      [Occasion.MARCH_8]: '8 марта (международный женский день)',
      [Occasion.FEBRUARY_23]: '23 февраля (день защитника отечества)',
      [Occasion.JUST_BECAUSE]: 'Просто так (без повода, по собственному желанию)',
      [Occasion.OTHER]: 'Другое',
    };
    return occasionMap[occasion];
  };

  async generateGiftIdeas(personDescription: GiftSessionDto): Promise<string[]> {
    const { base, ...rest } = personDescription;
    const filteredDescription = [
      `Возраст: ${base.age}`,
      `Пол: ${base.gender}`,
      `Повод для подарка: ${
        base.occasion === Occasion.OTHER && base.customOccasion
          ? base.customOccasion
          : this.getCyrillicOccasion(base.occasion)
      }`,
      rest.simpleDescription ? `Описание: ${rest.simpleDescription}` : null,
      rest.tags
        ? `Интересы: ${Object.entries(rest.tags)
          .map(([_, answers]) => `${answers.join(', ')}`)
          .join('. ')}`
        : null,
      rest.answers ? `Дополнительно: ${rest.answers.join(', ')}` : null,
    ];

    const prompt = `
      На основе характеристик человека, предложи 15 оригинальных идей подарков, которые соответствуют запросу:
      ${filteredDescription.join(', ')}
      Идеи подарков - короткие обощенные названия товаров на русском для поиска на маркет-плейсах (wildberries, ozon, yandex market). 
      Формат ответа: JSON названий, без лишнего текста и форматирования. Не предлагай варианты, которые уже есть у человека
    `;

    const body = {
      modelUri: 'gpt://b1g3nrtuc9d8hit7c6vj/yandexgpt-lite',
      completionOptions: {
        maxTokens: 400,
        temperature: 0.6,
      },
      messages: [
        {
          role: 'user',
          text: prompt,
        },
      ],
    };

    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Api-Key ${this.apiKey}`,
        },
      },
    );

    const text = response.data.result?.alternatives?.[0]?.message?.text ?? '[]';
    console.log(text);
    try {
      return parseStringToArray(text);
    } catch {
      return [text];
    }
  }
}

export function parseStringToArray(input: string): string[] {
  // Удаляем тройные кавычки ``` (в начале и в конце)
  const cleaned = input.replace(/^```|```$/g, '').trim();

  // Ищем часть, которая выглядит как JSON-массив
  const match = cleaned.match(/\[(.|\s)*\]/);
  if (!match) return [];

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error('Parsing error:', e);
    return [];
  }
}
