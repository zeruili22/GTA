# GTA: One Agent to Guide Them All

Project page, code, and release package for
**One Agent to Guide Them All: Empowering MLLMs for Vision-and-Language Navigation via Explicit World Representation** (CoRL 2026).

Project page: https://zeruili22.github.io/GTA/

## Release package

| Path | Contents |
|---|---|
| `data/episodes/r2r_ce_opennav_100.json` | 100 R2R-CE val-unseen episodes released by Open-Nav, used verbatim |
| `data/episodes/rxr_ce_en_260_seed1024.json` | Scene-stratified English RxR-CE sample (seed 1024) reported in the paper |
| `data/episodes/rxr_ce_en_300.json` | Uniform random English RxR-CE sample matching the BZS-VLN protocol |
| `scripts/sample_rxr.py` | Regenerates both RxR-CE lists from the seeds |
| `prompts/` | Full prompt template plus the w/o-PB and component-ablation variants |

Code: coming soon.

## Citation

```bibtex
@inproceedings{li2026gta,
  title     = {One Agent to Guide Them All: Empowering {MLLMs} for Vision-and-Language Navigation via Explicit World Representation},
  author    = {Li, Zerui and Zheng, Hongpei and Zhao, Fangguo and Shao, Yanyan and Zhou, Jian and Lin, Sihao and Li, Shijie and Wu, Qi},
  booktitle = {Conference on Robot Learning (CoRL)},
  year      = {2026}
}
```
