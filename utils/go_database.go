package utils

import (
	"context"
	"github.com/astaxie/beego/logs"
	"github.com/go-redis/redis"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

var RedisClient *redis.Client

func init() {
	NewClient()
	GetMgoCli()
}

func NewClient() *redis.Client {
	if RedisClient != nil {
		return RedisClient
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr: "10.128.1.232:6379",
		Password: "123456", // no password set
		DB:   0, // use default DB
	})

	_, err := RedisClient.Ping().Result()
	if err != nil {
		logs.Error("redis connection failed: ", err.Error())
	}
	return RedisClient
}


var MgoCli *mongo.Client

func initEngine() {
	var err error
	var clientOptions = options.Client().ApplyURI("mongodb://10.128.128.82:27017") // 连接到MongoDB
	MgoCli, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	// 检查连接
	err = MgoCli.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
}
func GetMgoCli() *mongo.Client {
	if MgoCli == nil {
		initEngine()
	}
	return MgoCli
}