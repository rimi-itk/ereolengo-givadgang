../ereolengo-givadgang.zip:
	rm -f $@
	(cd $(dir $@); zip -R $(notdir $@) ereolengo-givadgang/manifest.json ereolengo-givadgang/*.{css,js} ereolengo-givadgang/images/*[0-9].png)

.PHONY: ../ereolengo-givadgang.zip
