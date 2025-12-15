import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { GiftSessionDto } from './dto/gift-session.dto';
import { GiftFormat } from '@prisma/client';
import { GiftItemDto, GiftResponseDto } from './dto/gift-respone.dto';
import { InfiniteScrollPaginationDto } from '../dto/pagination.dto';
import { setTimeout } from 'timers/promises';

@Injectable()
export class GiftSessionService {
  constructor(private readonly aiService: AiService) {}

  async collectGiftSessionData(
    data: GiftSessionDto,
    _pagination: InfiniteScrollPaginationDto,
    queryFilters?: { costFrom?: string | number | null; costTo?: string | number | null; sources?: string | string[]; deliveryTime?: string | null },
  ): Promise<GiftResponseDto> {
    const response: GiftResponseDto = {};

    let suggestions: string[] = [
      'набор для вязания',
      'акварельные краски',
      'настольная игра для компании',
      'книга по кулинарии',
      'комплект для создания украшений',
      'набор для рисования',
      'электронная книга',
      'подписка на стриминговый сервис',
      'наушники с шумоподавлением',
      'набор для ухода за кожей',
      'модный аксессуар',
      'набор для приготовления коктейлей',
      'интерактивная музыкальная игрушка',
      'набор для создания интерьерных украшений',
      'игровая клавиатура с подсветкой'
    ];
    try {
      suggestions = await this.aiService.generateGiftIdeas(data);
    } catch (error) {
      console.error('AI service error', error);
      throw new HttpException(
        'Ошибка при запросе к AI-сервису',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const formatLinks: Record<GiftFormat, string[]> = {
      [GiftFormat.WILDBERRIES]: [
        'https://www.wildberries.ru/catalog/220043185/detail.aspx',
        'https://www.wildberries.ru/catalog/290444579/detail.aspx',
        'https://www.wildberries.ru/catalog/143426478/detail.aspx',
        'https://www.wildberries.ru/catalog/348282318/detail.aspx',
        'https://www.wildberries.ru/catalog/50409448/detail.aspx',
        'https://www.wildberries.ru/catalog/172679621/detail.aspx',
        'https://www.wildberries.ru/catalog/234966684/detail.aspx',
        'https://www.wildberries.ru/catalog/452787445/detail.aspx',
        'https://www.wildberries.ru/catalog/432818665/detail.aspx',
        'https://www.wildberries.ru/catalog/10302970/detail.aspx',
        'https://www.wildberries.ru/catalog/253309507/detail.aspx',
        'https://www.wildberries.ru/catalog/455048613/detail.aspx',
      ],
      [GiftFormat.OZON]: [
        'https://www.ozon.ru/product/nabor-aromakamney-pion-aromaticheskiy-diffuzor-dlya-doma-sashe-dlya-efirnyh-masel-2859224805/?at=08tYPQ5QjcnONOzEtMyqlJjSP9z01jSxzJYz3f0lAzWo',
        'https://www.ozon.ru/product/ecolatier-parfyumirovannyy-sprey-dlya-doma-aromaticheskiy-sprey-dlya-tekstilya-vanilla-wood-300-ml-1695826959/?at=Y7tjBmqm5crMqDoKFOY0Xls6ARPVGsn5QnOxsXmVny1',
        'https://www.ozon.ru/product/proektsiya-logotipa-avtomobilya-2-sht-art-honda-accord-7-8-2003-2015-zm-2-shtuki-900735543/?at=J8tgMlvlxTGDMxArtwM39xnFyNXyVQsJEVMQVu2VEmPr',
        'https://www.ozon.ru/product/kovrik-protivoskolzyashchiy-v-mashinu-rezinovyy-dlya-honda-1893787470/?at=qQtJwn3n9c4zmAADSJXgpoqc9Q94MBuo3PVyLiP7JzOg',
        'https://www.ozon.ru/product/shapka-2207537905/',
        'https://www.ozon.ru/product/hudi-karl-lagerfeld-1953336673/?at=LZtlnNQjxiylAXVvh8Vgw2KCZzlZLVfgzOZ0qiOXxlr9',
        'https://www.ozon.ru/product/playstation-geympad-dualsense-wireless-white-bluetooth-belyy-178716157/?at=Z8tX9PQ4ZSJOkZ20f2ZLLm3hWBooP4t01koojCEnkoPJ',
        'https://www.ozon.ru/product/futlyar-na-3-medali-s-gerbom-bordovyy-2827672531/',
        'https://www.ozon.ru/product/noski-10-par-1541598563/?at=WPtNmzD97iwkmm1AIjRNYRzsylyv1QixZNVK4tK65764',
        'https://www.ozon.ru/product/znachok-dungeon-dragons-d-d-1284868789/',
        'https://www.ozon.ru/product/korm-dlya-somov-akvariumnyh-60-gramm-tabletki-dlya-somov-somikov-812778712/?at=nRtrNlmO0IRJyn7uDPYxBOcWKL203iKvrNp4IqJr31y',
      ],
      [GiftFormat.YANDEX_MARKET]: [
        'https://market.yandex.ru/card/organayzer-dlya-kosmetiki/102027344181?hid=90401',
        'https://market.yandex.ru/card/v-dom-uyut-korzina-dlya-khraneniya-dlina-32-sm-shirina-24-sm-vysota-16-sm/4735043773?hid=90401',
        'https://market.yandex.ru/card/prochnyye-universalnyye-chekhly-na-avtomobilnyye-sidenya/4575251645?hid=90401',
        'https://market.yandex.ru/card/lampa-s-gribovidnymi-lampochkami-acusb-usb-plug-small-white-2-colors/4534532980?do-waremd5=4heya4cVBCViTFTLU6MO2Q&sponsored=1&cpc=bUmto57zSZAxr4UiaAnu7rCinB_mgM5xAKeJwxBWZcAcufj-yzesCsoFiPCVzvfvC3GNUCC2oAg3vX6d-Fm5HihWAzvtpm-y9eEvscJsXMUV-he1UthG5Jev3SlrRJzbjK2spotRQMreWNP0yDcmkxNuj3xCVf8ZR8JtTjcz-VlZa1Mf9JVwllmSkK4ZjMAU0hTclkq5_lc2lavnt64_fKJl8rzmxeXnpVPzaQ5iFKmNBKoDDmxolAOPYlFQIuzIWphuGwdNbNnxqMP8pH2go7hDXCri5-pMvslpOJG6XdUbdnYIaO_4WFGBdVlbt77CQ_PJls81C2KnURar9fXvL9Hbqh-kO_sYlxD8-wxMwHiiEUjV3kw4Uy_-56Q64tvk&ogV=-8',
        'https://market.yandex.ru/card/mini-brelok-igrovoy-avtomat-javrick-r/4318121568?do-waremd5=i1r_4r-Os3blKF4C-_X_TA&cpc=bUmto57zSZAoLMSWnJMsgU6_8hoICVJXB8oJ_-YaG7IeeUAdzOZEys6g3ugDsbq10C6fEkXM3jlJeushGp3sHwiZMfxuyHmxjodBSObWe2Gm1oncPkDOyL8IGbeQwv4tImMdi14iQjhPEFoJokfV1KRnsZbkxAgZtsXcsCv17g10myOsiWL8ul1O7MOQxB1-Va9lspuReQyZOIdUgvrKx5fSK0Hh2tFiqd4YGCtolMbX4Hv3z3e9k6tOsa4CxfaZeER44XpRpqkCoV2fNoQvSz_jtki9HYVibpwJsaFhZ65rVg2wpJ69vyqgqiSbg-7ooIPdYsZcWKsGTQMf2EiL2g%2C%2C&ogV=-8',
        'https://market.yandex.ru/card/mauroicardi-muzhskiye-oversayz-tolstovki-poliester-l-seryy/4379242864?do-waremd5=HCXYRsOhVugnBOaKfPA6XA&cpc=bUmto57zSZCJZpLE2b2scIglPNN2mg8LDtTWbOhtqHawlbNfdAzsqYLY2OL8rY43k0SttucKvhqdt5hrENjjV4Pa4kC8IrxxlsyskvWtt5pQVzeKWR1gcXTI20hUpNPc12dphDgHo_hSnvUsIFwG_06F40T4cSSuPtg0-tnCZvo44eweaUcY6YyInUXj-Xb_qSaZkNcKhMh3a9mUlygmUKqf_Nys47pA-78mKaAJ3AgY_a-7EUhujpCC4vareXWyUkC16WbZfsglJJ8BwwCDVournzmGaMrP3yufBbfj_j1d8ni1Ck3U_lhb-3XaJXSDp4NuaD8-NaaoGCposFVf_g%2C%2C&ogV=-8',
        'https://market.yandex.ru/card/ukrasheniye-rabochego-stola-abstraktnoye-geometricheskoye-khudozhestvennoye-oformleniye1-kusok/4474887364?do-waremd5=ojSq3OcJaUCiPIi4W3covQ&sponsored=1&cpc=bUmto57zSZBf6LH4F-7bG0Pz_m-tK6A3TSaHEdXtUKrsA5rqiU2u1Tm9czeiQ-Mt8YC8jJmgCHm1TYyJi41dhefpQY8fqlbTFD_QKjOSRYlygaOLWEG0Fx4TUkLZtZc4v9CrBCtuuQyMUZ4OdGks_LJCQL1lRJFjUArvLeV0Gd2E3EzOBCufea0SbzvGs4TZ8BVCxDbEa_zmsomahb-QTqLc8gyEFuh-w96X6MQ9RqJubN43i9QH9_YPWzOpzsXTjvbkzKnxLtqGXLMeWrlMm8vtMETLWySZOwfHyAuF75QQ_As8s_KtYaMwWdxcAZ7NuyEzmnVIjLbcRcAa-ow4leBwyOPhVXgB0v_nY5keOqy6WcNnXZoo1IAXCwpQeRGFjF2lzi3UM7nLpOA4WB4JA49r4SSSjxBhtA8pIWAk2HpGX-tAtx3IdjQUslsnR5ODatLSCGR3sBnl-d1--1cKIeOubp_VcF3oyUP-kiIVWVzrmlbl1s1u_mgz9nYETnWYKWjptGsgbR4%2C&ogV=-8',
        'https://market.yandex.ru/card/nike-gym-bags-coconut-milk--passion-red--black-nosize/4363002976?do-waremd5=VkXXbY1YnzVbXmQmacFK_g&sponsored=1&cpc=bUmto57zSZAC2WwXGXMyiNkBy5OFZ80X6wqUKS-mzdWB1r5RlgDzNW7fCUmK4dnmnGW-rha2aN_9DuJWlgH9oyp6zOdZz26GDEtzbsaFzCk_GDzSYm_CngWCpN_qpeiMxklCGPXoCtttcZgCK5JGs2NnD6kNe3FiYUj_IX1qfky9eJkjUNX2PDsXWc3DrHjPXNVPkybieoI0nEJmiZd9OL30liZjtNnPkRbQzoQHsOlalSHh7y5N1btVa7eKzWP3nd0JGKjqeEGWfSxNDm6uwsu1W5ZWlKNBeqzg7IrHpqQ9ZE5nKqnUmR5MOdL9UzkUzTp7mkKy4v39C7DiMoP0u8HOqaP16Ti_JHBIriwS_xWKDncTshJVWncY_4GjiRBfNaFLNHMfU1E%2C&ultima=1&ogV=-8',
        'https://market.yandex.ru/card/eksklyuzivnaya-podstavka-dlya-naushnikov-octopus-iz-vysokokachestvennoy-smoly-dlya-dekora-rabochego-prostranstva/4756001561?do-waremd5=L4stHOJ0g4CB9DI3auD5DQ&cpc=bUmto57zSZBvHMZYWtHXtneSgzdCRkab4NiN8ZdV0ysJbINRLHee_7OSSrU4RR8I7pPgEj4RwQaPx-YuCyrZ4yctG6BGJe-xMG3y504JDzQrEeqSIqZWfEKozty1KQpXz3J-imlpgnqeM7uuf0ZLiRBJdn9qIuTVYvZldCxK7mm36KFX_W1JdpOqVxGaeN0GnrK_iuimidw5AsijcTDbqftxSs_ns3JZWq0lt8xWG-pb5UEAVNpPDi1GUenIklM8OE1NzEZCUFYy-moB56PhKGUt5qGIG14O5Ykco5yOiorHaRZK9Xr1mZH4T6fM2plfGyK012GxFgimP_ezX_pMwc9DgiJOkshldzhme3bk1HTA3HAyVmrZda1SaaOGwJRM&ogV=-8',
        'https://market.yandex.ru/card/befree-bf2533101022-50-xl/4470737044?do-waremd5=x4dMSehH1ERnmwOaipmCrQ&cpc=bUmto57zSZBWu6-8hzjkWFDf1SQaLfRlnoraJlOTzM0Axvzthzd-ZQfdkvKcMiOqmY4CMntW9HYftcXnRYdNGf1wKDpFyqIRG1LVYAN3dJJ_u-3PFLsOly0hyxj_uqCX8dajTzDTY4OMLbh-3Fjp8KfeegPcwOJVZzuqZCp8PXD-kVmXIaxWkJ7d55wLr3PrYAtLtGOzWrVgMYNX5Ht6U3dpAhLLIvOkcI9DVAAmL3p4R7VP8gvH6iaIRw5xCg07plHUNcL01s1xWSIU3sMGq0xz2lVaWxM3CSbYHNxA5Rb5sHf0W4hTHP2kcFX7OzvfIb-NXqaB3CMTYNZwZVScVw%2C%2C&ogV=-8',
      ],
      [GiftFormat.IDEA_ONLY]: [
        'пока',
        'не решил'
      ],
    };
    const gifts: Array<GiftItemDto> = [];

    suggestions.forEach((suggestion) => {
      // выбрать случайный формат из effectiveFormats
      let currFormat = data.base.formats.find((item) => formatLinks[item]) || GiftFormat.WILDBERRIES

      // случайный url и (отдельно) случайное изображение, если есть
      const url = formatLinks[currFormat].length ? formatLinks[currFormat][Math.floor(Math.random() * formatLinks[currFormat].length)] : '';
      const image = formatLinks[currFormat].length ? formatLinks[currFormat][Math.floor(Math.random() * formatLinks[currFormat].length)] : '';

      const price = Math.floor(Math.random() * (5000 - 300 + 1)) + 300;

      gifts.push({
        name: suggestion,
        source: currFormat,
        price,
        image,
        description: `${suggestion} — подходящий вариант подарка.`,
        url,
      });
    });

    // Собираем общие фильтры: только из query-параметров (удалено использование body)
    const q = queryFilters || {};

    const costFrom = q.costFrom != null && q.costFrom !== '' ? Number(q.costFrom) : null;
    const costTo = q.costTo != null && q.costTo !== '' ? Number(q.costTo) : null;

    let sourcesArr: string[] = [];
    if (q.sources) {
      if (Array.isArray(q.sources)) {
        sourcesArr = q.sources.map(String).map(s => s.trim()).filter(Boolean);
      } else {
        sourcesArr = String(q.sources).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const deliveryTime = q.deliveryTime ?? null;

    const filters = {
      costFrom,
      costTo,
      sources: sourcesArr,
      deliveryTime,
    };

    response.gifts = gifts;
    response.filters = filters;

    // await setTimeout(Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000);

    return response;
  }
}
