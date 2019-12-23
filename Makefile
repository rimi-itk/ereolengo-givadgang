../ereolengo-givadgang.zip:
	(cd $(dir $@); zip -R $(notdir $@) ereolengo-givadgang/*.{css,js,json} ereolengo-givadgang/images/*[0-9].png)

.PHONY: ../ereolengo-givadgang.zip
